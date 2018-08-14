'use strict';

module.exports = {
  getLobby: () => {
    return {
      command: 'getLobby',
    };
  },

  gameList: () => {
    return {
      command: 'gameList',
    };
  },

  spec: (gameId) => {
    return {
      command: 'spec',
      payload: {
        gameId,
      },
    };
  },

  leaveSpec: (gameId) => {
    return {
      command: 'leaveSpec',
      payload: {
        gameId,
      },
    };
  },

  giveUp: (gameId) => {
    return {
      command: 'giveUp',
      payload: {
        gameId,
      },
    };
  },

  gameWith: (name) => {
    return {
      command: 'gameWith',
      payload: {
        guestId: name,
      },
    };
  },

  draw: (gameId, x, y ) => {
    return {
      command: 'draw',
      payload: {
        gameId,
        x,
        y,
      },
    };
  },
};
