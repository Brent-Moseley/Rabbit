Rabbit Work Queue
=================

This program simply sends a specified number of random messages to a message queue (simulating jobs to be done), displaying what was sent.
It is intended that one of a series of job workers (run in a separate terminal session via receive.js)
will pick up the messaage, sleep for a given time period to simulate "work", and then grab the next message.
You will need to have RabbitMQ running in a terminal session. 
