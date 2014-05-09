#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

// This program simply sends 10 random messages to the message queue, and displays those messages.
// It is intended that one of the job workers (run in a separate terminal session via receive.js)
// will pick up a messaage, sleep for a given time period to simulate "work", and then grab the next message.
// The number of periods at the end of the message determines the relative sleep time.
// Use:   node send.js [num_messages]
// Note:  You will need to have one or more receivers listening the queue you want to send to, in separate terminal session(s).
//        You can view the monitor console at http://localhost:15672/   login guest, pwd guest

var messages = ['Hello World...', 'Damn, its hot in here..', 'Node rocks....', 'Who shot JR........', 'Tear down this wall..........', 'Victory in Europe..................',
'The only thing we have to fear....', 'Wheres Waldo?......', 'Javascript over Java.......', 'A date which will live in infamy!...', 'Leggo my Eggo........'];

// Connect to local RabbitMQ server
amqp.connect('amqp://localhost').then(function(conn) {
  // create / return the channel, if possible.  Here is good documentation on the when helper function: http://howtonode.org/promises
  return when(conn.createChannel().then(function(ch) {
    var q = 'main';
    var NUM_MESSAGES = typeof process.argv[2] !== 'undefined' ? parseInt(process.argv[2]) : 10;     // How many messages to send, get from command line argument or default to 10. 
    var messageId = Math.floor(Math.random() * 1000);   // Generate a random starting message ID

    // Set the queue to listen to
    var ok = ch.assertQueue(q, {durable: true});
    
    // set the message queue handler function
    return ok.then(function(_qok) {
      // Send messages to the asked for queue
      console.log ("CREATING " + NUM_MESSAGES + " messages...");
      for (var i = 0; i < NUM_MESSAGES; i++) {
        var msg = messageId.toString() + '-' + messages[Math.floor(Math.random() * messages.length)];
        messageId++;
        ch.sendToQueue(q, new Buffer(msg), {deliveryMode: true});
        console.log(" [x] Sent '%s' to queue '%s'", msg, q);
      }
      // then close that channel
      return ch.close();
    });
  // close the connection, as the last thing you do 
  })).ensure(function() { conn.close(); });;
}).then(null, console.warn);