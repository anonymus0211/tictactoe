import Vue from 'vue';
import * as tcpCommands from '@/helpers/tcpCommands';

const socket = new WebSocket('ws://127.0.0.1:8081');

const emitter = new Vue({
  methods: {
    send(message) {
      if (socket.readyState === 1) {
        socket.send(JSON.stringify(message));
      }
    },
    isReady() {
      return (socket.readyState === 1);
    },
  },
});

socket.onopen = () => {
  socket.send(JSON.stringify(tcpCommands.initInfo()));
  socket.send(JSON.stringify(tcpCommands.getLobby()));
  socket.send(JSON.stringify(tcpCommands.gameList()));
};

socket.onmessage = (msg) => {
  emitter.$emit('message', msg.data);
};

socket.onerror = (err) => {
  emitter.$emit('error', err);
};


export default emitter;
