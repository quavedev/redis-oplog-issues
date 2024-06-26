import { Meteor } from 'meteor/meteor';

const getRedisOplogConfigJsonOrNull = () => {
  if (process.env.REDIS_OPLOG_SETTINGS) {
    return JSON.parse(process.env.REDIS_OPLOG_SETTINGS);
  }

  if (Meteor.settings.redisOplog) {
    return Meteor.settings.redisOplog;
  }

  return null;
};

const logMessage = (...args) => {
  try {
    log(...args);
  } catch (error) {
    // we don't want to log error, ReferenceError will happen in the startup of ddp-server
    console.log(...args);
  }
};

const logError = (...args) => {
  logMessage(...args);
};

function getObserveKeyFields(observeKeyString) {
  try {
    if (!observeKeyString) {
        return {};
    }

    const observeKey = JSON.parse(observeKeyString);

    return {
      ...(observeKey.collectionName && {
        collectionName: observeKey.collectionName,
      }),
      ...(observeKey?.selector?.teamId && {
        teamId: observeKey.selector.teamId,
      }),
      ...(observeKey?.selector?.campaignId && {
        teamId: observeKey.selector.campaignId,
      }),
        ...(observeKey?.selector?._id?.$in?.[0] && {
            observerFirstId: observeKey.selector._id.$in[0],
        }),
        ...(observeKey?.selector?.teamId?.$in?.[0] && {
            teamId: observeKey.selector.teamId.$in[0],
        }),
        ...(observeKey?.selector?.campaignId?.$in?.[0] && {
            campaignId: observeKey.selector.campaignId.$in[0],
        }),
    };
  } catch (e) {
    return {};
  }
}

export const getAdvancedDebug =
  (currentPackage) =>
  /**
   * This function is shared between packages.
   *
   * If you change it copy to the other package. Just the function and not the whole file.
   *
   * Paths: redis-oplog/lib/debug.js, ddp-server/debug.js
   *
   * @param log Message for the log
   * @param trace Want to see trace
   * @param error Error
   * @param data expects an object with possible fields: channel, message, doc
   */
  ({ log, trace = false, error, ...data }) => {
    if (!getRedisOplogConfigJsonOrNull()?.debugOptions?.enabled) {
      return;
    }

    const dataIsEmpty = !Object.keys(data).length;

    const observeKeyFields = getObserveKeyFields(data.observeKey) || {};
    const preparedData = {
      ...data,
      ...(data.cursorDescription && {
        ...(data.cursorDescription.selector?.teamId && {
          teamId: data.cursorDescription.selector.teamId,
        }),
        ...(data.cursorDescription.collectionName && {
          collectionName: data.cursorDescription.collectionName,
        }),
        ...(data.cursorDescription.selector && {
          selector: data.cursorDescription.selector,
        }),
        ...(data.cursorDescription.options?.sort && {
          sort: data.cursorDescription.options.sort,
        }),
      }),
      ...observeKeyFields,
    };

    const {
      prefix = '',
      debugFieldsToFilter = {},
      allFieldsMustMatch = true,
      verboseAdvancedDebug,
      matchEmptyData = false,
      logFieldOnly = false,
    } = getRedisOplogConfigJsonOrNull()?.debugOptions || {};

    const logPrefix = `${prefix} [${currentPackage}] ${log}`;
    const dataAsString = `${JSON.stringify(preparedData, null, 2)}`;

    if (error) {
      logError(`${logPrefix}, data: ${dataAsString}`, error);
    }

    const debugSpecificFieldValues = !!Object.keys(debugFieldsToFilter).length;
    if (!matchEmptyData && !debugSpecificFieldValues) {
      return;
    }

    const emptyDataIsMatch = matchEmptyData && dataIsEmpty;

    const match = ([key, value]) => value === preparedData[key];

    if (debugSpecificFieldValues) {
      if (
        !emptyDataIsMatch &&
        !allFieldsMustMatch &&
        !Object.entries(debugFieldsToFilter).some(match)
      ) {
        if (verboseAdvancedDebug) {
          logMessage(
            `[VERBOSE] ${logPrefix} not a single match, data: ${dataAsString}`
          );
        }
        return;
      }

      if (
        !emptyDataIsMatch &&
        allFieldsMustMatch &&
        !Object.entries(debugFieldsToFilter).every(match)
      ) {
        if (verboseAdvancedDebug) {
          logMessage(
            `[VERBOSE] ${logPrefix} not all match, data: ${dataAsString}`
          );
        }
        return;
      }
    }

    const matchedFields = debugSpecificFieldValues
      ? Object.entries(debugFieldsToFilter)
          .filter(match)
          .map(([key, value]) => `${key}: ${value}`)
      : '';
    logMessage(
      logFieldOnly
        ? logPrefix
        : `${logPrefix} match={${emptyDataIsMatch ? 'empty' : matchedFields}}, data: ${dataAsString}`
    );

    if (trace) {
      logMessage(trace);
    }
  };
