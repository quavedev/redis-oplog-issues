# Redis Oplog Issues

App to validate new logs in Redis Oplog and DDP Server.

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
docker lgs -f my-redis-container
```

## How to run Multiple Meteor Instances

```bash
MONGO_URL=mongodb://localhost:27017/redis-issues meteor run --port 3000 --settings settings.json
MONGO_URL=mongodb://localhost:27017/redis-issues meteor run --port 3005 --settings settings.json
```
