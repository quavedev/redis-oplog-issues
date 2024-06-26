# Redis Oplog Issues

App to validate new logs in Redis Oplog and DDP Server packages.

This is a small app with easy ways in the UI to do inserts and removes.

Also, updates by id, by another field, and multi updates.

## How to run Redis

Verbose mode to produce more logs

```bash
docker pull redis
docker run --name my-redis-container -p 6379:6379 -d redis redis-server --loglevel verbose
```  

## How to connect to redis

Install Redis CLI in Mac:

```bash
brew install redis
redis-cli -h localhost -p 6379   
ping
# should reply PONG
```

## Check Redis logs

```bash
docker logs -f my-redis-container
```

## How to run Multiple Meteor Instances

```bash
MONGO_URL=mongodb://localhost:27017/redis-issues meteor run --port 3000 --settings settings.json
MONGO_URL=mongodb://localhost:27017/redis-issues meteor run --port 3005 --settings settings.json
```
