import { Strategy } from '../constants';
import { getProcessor } from '../processors';
import { Meteor } from 'meteor/meteor';
import extractIdsFromSelector from '../utils/extractIdsFromSelector';
import RedisSubscriptionManager from './RedisSubscriptionManager';
import syntheticProcessor from '../processors/synthetic';
import getDedicatedChannel from '../utils/getDedicatedChannel';
import { getAdvancedDebug } from 'meteor/advanced-debug';

export default class RedisSubscriber {
  /**
   * @param observableCollection
   * @param strategy
   */
  constructor(observableCollection, strategy) {
    this.observableCollection = observableCollection;
    this.strategy = strategy;
    this.processor = getProcessor(strategy);

    // We do this because we override the behavior of dedicated "_id" channels
    this.channels = this.getChannels(this.observableCollection.channels);
    if (
      this?.observableCollection?.cursorDescription?.selector?.teamId ===
      'tea_b834id4r7skME8mfW'
    ) {
      var getStackTrace = function () {
        var obj = {};
        Error.captureStackTrace(obj, getStackTrace);
        return obj.stack;
      };

      log('constructor redis subscriber', {
        oldChannels: this.observableCollection.channels,
        newChannels: this.channels,
        strategy: this.strategy,
        trace: getStackTrace(),
      });
    }
    RedisSubscriptionManager.attach(this);
  }

  /**
   * @param channels
   * @returns {*}
   */
  getChannels(channels) {
    const collectionName = this.observableCollection.collectionName;

    switch (this.strategy) {
      case Strategy.DEFAULT:
      case Strategy.LIMIT_SORT:
        return channels;
      case Strategy.DEDICATED_CHANNELS:
        const ids = extractIdsFromSelector(this.observableCollection.selector);

        return ids.map((id) => getDedicatedChannel(collectionName, id));
      default:
        throw new Meteor.Error(`Strategy could not be found: ${this.strategy}`);
    }
  }

  /**
   * @param args
   */
  process(...args) {
    this.processor.call(null, this.observableCollection, ...args);
  }

  /**
   * @param event
   * @param doc
   * @param modifier
   * @param modifiedTopLevelFields
   */
  processSynthetic(event, doc, modifier, modifiedTopLevelFields) {
    syntheticProcessor(
      this.observableCollection,
      event,
      doc,
      modifier,
      modifiedTopLevelFields
    );
  }

  /**
   * Detaches from RedisSubscriptionManager
   */
  stop() {
    try {
      RedisSubscriptionManager.detach(this);
    } catch (e) {
      getAdvancedDebug('redis-oplog')({
        log: `[RedisSubscriber] Weird! There was an error while stopping the publication: `,
        error: e,
      });
    }
  }

  /**
   * Retrieves the fields that are used for matching the validity of the document
   *
   * @returns {array}
   */
  getFieldsOfInterest() {
    return this.observableCollection.fieldsOfInterest;
  }
}
