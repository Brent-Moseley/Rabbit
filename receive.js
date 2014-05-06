#!/usr/bin/env node

var amqp = require('amqplib');

// Sample program simply listens to a given message queue, and displays messages
// Use:   node receive.js [name_of_queue]

// Connect to local RabbitMQ server that is running (install, then run from a terminal via: rabbitmq-server)
//   .then is a promise that executes the function once the connection is established.
amqp.connect('amqp://localhost').then(function(conn) {
  // Handle the UNIX INT signal to close the connection.
  process.once('SIGINT', function() { conn.close(); });
  
  // Create the channel to listen on, giving it the event handler function (which gets the channel as the param ch).
  return conn.createChannel().then(function(ch) {
    var queue = process.argv[2];
    // Set the queue to listen to
    var ok = ch.assertQueue(queue, {durable: false});
    
    // Once the queue is created, provide the function to handle incoming messages
    ok = ok.then(function(_qok) {
      // "consume" the message, just printing it out to the console.
      return ch.consume(queue, function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
      }, {noAck: true});
    });
    
    // display message when handler is listening for messages on the queue.
    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages on ' + queue + '. To exit press CTRL+C');
    });
  });
}).then(null, console.warn);    // show error if connection could not be established.