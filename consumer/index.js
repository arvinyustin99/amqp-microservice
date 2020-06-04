const amqp = require('amqplib/callback_api');
const SQLconnection = require('./dbConnection');
const response_queue = 'response_queue';

amqp.connect('amqp://rabbitmq', (err, conn) => {
	if (err)
		throw err;
	/**
	 *  FIND-STUDENT-BY-ID
	 */
	conn.createChannel((err, channel) => {
		let temp = '';

		channel.assertQueue('find', {durable: true});
		channel.assertQueue(response_queue, {durable: true});

		channel.consume('find', (msg) => {
			console.log('[X] Channel \'find\' received: \'' + msg.content.toString() + '\'');
			
			// Parsing Integer, validate

			temp = parseInt(msg.content.toString());
			if (Number.isInteger(temp)){
				SQLconnection.query('SELECT * FROM student WHERE registration_number=' + temp, (err, result, fields) =>{
					if (err)
						throw err;
					channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
						correlationId: msg.properties.correlationId
					});
				});
			}

		}, {noAck: true});
	});

	/**
	 * CREATE BY NAME 
	 */
	conn.createChannel((err, channel) => {
		channel.assertQueue('create', {durable: true});
		channel.assertQueue(response_queue, {durable: true});
		channel.consume('create', (msg) => {

			console.log('[X] Channel \'create\' received: \'' + msg.content.toString() + '\'');

			SQLconnection.query('INSERT INTO student (name) VALUES (\'' + msg.content.toString() + '\')', (err, result, fields) => {
				if (err)
					throw err;
				channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
					correlationId: msg.properties.correlationId
				});
			});
		}, {noAck: true});
	});
});


/* TODO
1. Buat 2 queue
2. Buat endpoint
3. Dockerize */