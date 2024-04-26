const Config = {
  isInitialized: false,
  debug: false,
  mutationDefaults: {
    pushToRedis: true,
    optimistic: true,
  },
  cacheTimeout: 15*60*1000, // 15 mins
  cacheTimer: 5*60*1000, // 5 mins
  redis: {
    port: 6379,
    host: '127.0.0.1',
  },
  oplogToRedis: false, // unsupported for now
  retryIntervalMs: 1000,
  secondaryReads: null, // are you reading from secondary mongo nodes -- set to null and we will parse MONGO_URL
  raceDetectionDelay: 1000, // how long until all mongo nodes are assumed to have been replicated
  raceDetection: true,
  redisExtras: {
    retry_strategy: function(/* options */) {
      return Config.retryIntervalMs
      // reconnect after
      // return Math.min(options.attempt * 100, 30000);
    },
    events: {
      end(/*err*/) {
        console.error('RedisOplog: Connection to redis ended')
      },
      error(err) {
        console.error(`RedisOplog: An error occured: \n`, JSON.stringify(err))
      },
      connect(err) {
        if (!err) console.log('RedisOplog: Established connection to redis.')
        else console.error('RedisOplog: There was an error when connecting to redis', JSON.stringify(err))
      },
      reconnecting(err) {
        if (err) console.error('RedisOplog: There was an error when re-connecting to redis', JSON.stringify(err))
      }
    }
  }
}

export default Config
