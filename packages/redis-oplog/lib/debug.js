import Config from "./config";

const redisOplogConfig = Config;

export default (message, trace = false) => {
  if (redisOplogConfig.debug) {
    const timestamp = new Date().getTime();
    console.debug(`[${timestamp}] - ` + message);

    if (trace) {
      console.debug(trace);
    }
  }
};

const currentPackage = 'redis-oplog';
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
export const advancedDebug = ({ log, trace = false, error, ...data }) => {
  if (!redisOplogConfig?.debug) {
    return;
  }

  const dataIsEmpty = !Object.keys(data).length;

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
  };

  const {
    prefix = "",
    debugFieldsToFilter = {},
    allFieldsMustMatch = true,
    verboseAdvancedDebug,
    matchEmptyData = false,
  } = redisOplogConfig.debugOptions || {};

  const logPrefix = `${prefix} [${currentPackage}] ${log}`;
  const dataAsString = `${JSON.stringify(preparedData, null, 2)}`;

  if (error) {
    console.error(`${logPrefix}, data: ${dataAsString}`, error);
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
        console.log(`${logPrefix} not a single match, data: ${dataAsString}`);
      }
      return;
    }

    if (
        !emptyDataIsMatch &&
        allFieldsMustMatch &&
        !Object.entries(debugFieldsToFilter).every(match)
    ) {
      if (verboseAdvancedDebug) {
        console.log(`${logPrefix} not all match, data: ${dataAsString}`);
      }
      return;
    }
  }

  const matchedFields = debugSpecificFieldValues
      ? Object.entries(debugFieldsToFilter)
          .filter(match)
          .map(([key, value]) => `${key}: ${value}`)
      : "";
  console.debug(
      `${logPrefix} match={${emptyDataIsMatch ? "empty" : matchedFields}}, data: ${dataAsString}`,
  );

  if (trace) {
    console.debug(trace);
  }
};