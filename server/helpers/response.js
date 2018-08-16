'use strict';

const parseInputData = (socketData) => {
  try {
    const inputStr = socketData.toString('utf8');
    return JSON.parse(inputStr);
  } catch (error) {
    console.error(error);
  }
};

const sendResponse = (socket, command, data, error = null) => {
  let resp = {};
  if (error) {
    resp.error = error;
  } else {
    resp.command = command;
    resp.data = data;
  }

  resp = JSON.stringify(resp) + '\n';
  if (socket.write) {
    return socket.write(resp);
  }

  if (socket.send) {
    return socket.send(resp);
  }
  
};

const sendError = (socket, error) => {
  return sendResponse(socket, null, null, error);
};

module.exports = {
  parseInputData,
  sendResponse,
  sendError,
};
