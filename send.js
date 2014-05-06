#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

// Sample program simply sends a random message to a given message queue, and displays messages
// Use:   node send.js [name_of_queue]
// Note:  You will need to have a receiver listening to each queue you want to send to, in a separate terminal session.

var messages = ['Hello World!', 'Damn, its hot in here!', 'Node rocks!', 'Who shot JR?', 'Tear down this wall!', 'Victory in Europe', 'The only thing we have to fear', 'Wheres Waldo?'];

// Connect to local RabbitMQ server
amqp.connect('amqp://localhost').then(function(conn) {
  // create / return the channel, if possible.  Here is good documentation on the when helper function: http://howtonode.org/promises
  return when(conn.createChannel().then(function(ch) {
    var q = process.argv[2];
    var msg = messages[Math.floor(Math.random() * messages.length)];

    // Set the queue to listen to
    var ok = ch.assertQueue(q, {durable: false});
    
    // set the message queue handler function
    return ok.then(function(_qok) {
      // Send one message to the asked for queue
      ch.sendToQueue(q, new Buffer(msg));
      console.log(" [x] Sent '%s' to queue '%s'", msg, q);
      // then close that message
      return ch.close();
    });
  // close the connection, as the last thing you do 
  })).ensure(function() { conn.close(); });;
}).then(null, console.warn);