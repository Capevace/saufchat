const cluster = require('sticky-cluster');
const startServer = require('./src/server');

cluster(startServer, {
  concurrency: process.env.WEB_CONCURRENCY || 1,
  port: process.env.PORT || 8080
});
