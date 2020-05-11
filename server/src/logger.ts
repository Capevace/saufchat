import winston from 'winston';

export default winston.createLogger({
	level: 'silly',
	format: winston.format.json(),
	defaultMeta: { service: 'api.sauf.chat' },
	transports: [
		//
		// - Write all logs with level `error` and below to `error.log`
		// - Write all logs with level `info` and below to `combined.log`
		//
		// new winston.transports.File({ filename: 'error.log', level: 'error' }),
		// new winston.transports.File({ filename: 'combined.log' })
		new winston.transports.Console({ format: winston.format.simple() })
	]
});
