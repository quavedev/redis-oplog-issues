import { Events } from '../constants';
import { Meteor } from 'meteor/meteor';

/**
 * @param observableCollection
 * @param event
 * @param doc
 * @param modifiedFields
 */
export default function (observableCollection, event, doc, modifiedFields) {
  switch (event) {
    case Events.UPDATE:
      handleUpdate(observableCollection, doc, modifiedFields);
      break;
    case Events.REMOVE:
      handleRemove(observableCollection, doc);
      break;
    case Events.INSERT:
      handleInsert(observableCollection, doc);
      break;
    default:
      throw new Meteor.Error(`Invalid event specified: ${event}`);
  }
}

/**
 * @param observableCollection
 * @param doc
 */
const handleInsert = function (observableCollection, doc) {
  if (
    !observableCollection.contains(doc._id) &&
    observableCollection.isEligible(doc)
  )
    observableCollection.add(doc);
};

/**
 * @param observableCollection
 * @param doc
 * @param modifiedFields
 */
const handleUpdate = function (observableCollection, doc, modifiedFields) {
  const otherSelectors = observableCollection.__containsOtherSelectorsThanId;
  if (otherSelectors) {
    if (observableCollection.isEligible(doc)) {
      if (observableCollection.contains(doc._id))
        observableCollection.change(doc, modifiedFields);
      else observableCollection.add(doc);
    } else {
      // doc has become ineligible
      if (observableCollection.contains(doc._id))
        observableCollection.remove(doc._id);
    }
  } else {
    if (observableCollection.contains(doc._id))
      observableCollection.change(doc, modifiedFields);
    else observableCollection.add(doc);
  }
};

/**
 * @param observableCollection
 * @param doc
 */
const handleRemove = function (observableCollection, doc) {
  if (observableCollection.contains(doc._id))
    observableCollection.remove(doc._id);
};
