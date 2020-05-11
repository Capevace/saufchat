const path = require('path');
const ncp = require('ncp').ncp;

const source = path.resolve(__dirname, '../saufchat-ui/dist');
const destination = path.resolve(__dirname, './ui-dist/');

ncp(source, destination, function (err) {
	if (err) {
		return console.error(err);
	}

	console.log('done!');
});