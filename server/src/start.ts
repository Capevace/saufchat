import cluster from 'sticky-cluster';
import startServer from '@/server';

cluster(startServer, {
	concurrency: parseInt(process.env.WEB_CONCURRENCY || '1'),
	port: parseInt(process.env.PORT || '8080')
});
