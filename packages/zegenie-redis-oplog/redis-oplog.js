import './lib/mongo/mongoCollectionNames'

import { RedisPipe, Events } from './lib/constants'
import { Meteor } from 'meteor/meteor'
import init from './lib/init'
import Config from './lib/config'
import { getRedisListener, getRedisPusher } from './lib/redis/getRedisClient'
import ObservableCollection from './lib/cache/observableCollection'
import { addToWatch, removeFromWatch } from './lib/redis/watchManager'
import { dispatchUpdate, dispatchInsert, dispatchRemove } from './lib/redis/customPublish'
import Vent from './lib/vent/Vent'

const RedisOplog = {
  init
}

// Warnings
Meteor.startup(function() {
  // eslint-disable-next-line
  if (Package.insecure) console.log('RedisOplog does not support the insecure package.')
})

export {
  RedisOplog,
  ObservableCollection,
  RedisPipe,
  Config,
  Events,
  Vent,
  getRedisListener,
  getRedisPusher,
  addToWatch,
  removeFromWatch,
  dispatchUpdate,
  dispatchInsert,
  dispatchRemove
}

if (process.env.REDIS_OPLOG_SETTINGS) {
  init(JSON.parse(process.env.REDIS_OPLOG_SETTINGS))
}
else if (Meteor.settings.redisOplog) {
  init(Meteor.settings.redisOplog)
}
else {
  console.error('RedisOplog: No settings found')
}
