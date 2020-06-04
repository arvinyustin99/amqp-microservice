const mysql = require('mysql');

const SQLconnection = mysql.createConnection({
	host: 'db',
	user: 'arvinyustin99',
	password: 'arvinyustin99',
	database: 'dblatihan',
	port: '3306'
});

SQLconnection.connect(err => {
	if (err)
		throw err;
	console.log('Connected')
});

module.exports = SQLconnection;