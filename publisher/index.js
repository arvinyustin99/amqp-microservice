const amqp = require('amqplib/callback_api');
const express = require('express');

const port = 2000;
const app = express();

let content = '';
let queue_name = '';
const response_queue = 'response_queue';
let response = '';

let sendMessage = (channel, queue, content, corrID) => {
	channel.sendToQueue(queue, Buffer.from(content), {
		correlationId: corrID,
		replyTo: response_queue
	});
	console.log('[X] Sent ' + content + ' into queue \'' + queue + '\' with ID: ' + corrID);
};

amqp.connect('amqp://rabbitmq', (err, conn) => {
	if (err)
		throw err;
	
	// Creating Channel for SENDING MESSAGE
	
	conn.createChannel((err, channel) => {
		let correlationID = '';
		channel.assertQueue('find', {durable: true});
		channel.assertQueue('create', {durable: true});
		channel.assertQueue(response_queue, {durable: true});
		
		setInterval(() => {
			if (content != '' && queue_name != ''){
				correlationID = generateUniqueID();
				sendMessage(channel, queue_name, content, correlationID);
				content = '';
				queue_name = '';
			}
		}, 1000);

		// Waiting for response

		channel.consume(response_queue, (msg) => {
			if (msg.properties.correlationId === correlationID){
				console.log(msg.content.toString());
				response = msg.content.toString();
			}
		}, { noAck: false});
	});
});
app.get('/find/:id', (req, res) => {
	content = req.params.id;
	queue_name = 'find';
	res.send(response);
});

app.get('/create/:name', (req, res) => {
	content = req.params.name;
	queue_name = 'create';
});

function generateUniqueID (){
	return Math.floor((Math.random() * 10000)).toString();
}

app.listen(port);
module.exports = express.Router;