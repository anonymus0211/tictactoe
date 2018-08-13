'use strict';

const parseInputData = (socketData) => {
  try {
    const inputStr = socketData.toString('utf8');
    return JSON.parse(inputStr);
  } catch (error) {
    console.error(error);
  }
}

const sendResponse = (socket, command, data, error = null) => {
  const resp = {};
  if (error) {
    resp.error = error;
  } else {
    resp.command = command;
    resp.data = data;
  }

  return setImmediate(() => socket.write(JSON.stringify(resp)));
}

const sendError = (socket, error) => {
  return sendResponse(socket, null, error);
}

module.exports = {
  parseInputData,
  sendResponse,
  sendError,
}