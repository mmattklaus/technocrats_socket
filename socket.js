/**
 * Author: Matt-Klaus Mushi
 * Email: devloper.mattklaus@gmail.com
 */

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mattklaus-OMEN');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

client.on('connect', () => {
    // Inform controllers that garage is connected
    // client.publish('garage/connected', 'true');
    client.subscribe('technocrat/temp');
    client.subscribe('technocrat/humid');
    console.log('Connected to mqtt server');
});

client.on('message', (topic, data) => {
    console.log(`Message received: ${data}`)
    // client.publish(topic, message);
    if (io) {
        io.emit(topic, { value: data, date: new Date()});
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});