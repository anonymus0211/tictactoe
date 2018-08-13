'use strict';

module.exports = {
  gameWith: (name) => {
    return {
      command: 'gameWith',
      payload: {
        guestId: name,
      },
    };
  },

  
}