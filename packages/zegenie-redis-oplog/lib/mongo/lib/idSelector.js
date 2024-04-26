import { _ } from 'meteor/underscore'

export function isIdSelector(selector) {
  if (typeof selector == 'string') return true
  return selector && selector._id && _.keys(selector).length == 1
}

export function getIdsFromSelector(selector) {
  if (typeof selector == 'string') return [selector]
  return typeof selector._id === 'string' ? [selector._id] : _.isObject(selector._id) && selector._id.$in ? selector._id.$in : null
}
