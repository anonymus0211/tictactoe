const net = require('net');

const HOST_PORT = 1337;
const HOST_IP = '127.0.0.1';

const client = new net.Socket();
client.connect(HOST_PORT, HOST_IP, function() {
	console.log('Connected');
	client.write(JSON.stringify({ command: 'getLobby' }));
});

client.on('data', function(data) {
  console.log('Received: ' + data);
  console.log(JSON.parse(data));
  // client.destroy(); // kill client after server's response
  
});

client.on('close', function() {
  console.log('Connection closed');
  client.setTimeout(2000, function() {
    client.connect(HOST_PORT, HOST_IP);
  })
});

client.on('error', function(e) {
  console.log(e);
  client.setTimeout(2000, function() {
    client.connect(HOST_PORT, HOST_IP);
  })
})