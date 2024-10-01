// redisClient.js
import Redis from 'ioredis';

// Connect to Redis on the Docker container using the default port 6379
const redis = new Redis({
    host: 'localhost',  // Redis is running on localhost because Docker is mapped to localhost:6379
    port: 6379,
});

// Test Redis connection
redis.on('connect', () => {
    console.log('Connected to Redis successfully!');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redis;
