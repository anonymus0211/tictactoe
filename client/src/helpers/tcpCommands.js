export function getLobby() {
  return {
    command: 'getLobby',
  };
}

export function gameList() {
  return {
    command: 'gameList',
  };
}

export function spec(gameId) {
  return {
    command: 'spec',
    payload: {
      gameId,
    },
  };
}

export function leaveSpec(gameId) {
  return {
    command: 'leaveSpec',
    payload: {
      gameId,
    },
  };
}

export function giveUp(gameId) {
  return {
    command: 'giveUp',
    payload: {
      gameId,
    },
  };
}

export function gameWith(guestId) {
  return {
    command: 'gameWith',
    payload: {
      guestId,
    },
  };
}

export function draw(gameId, x, y) {
  return {
    command: 'draw',
    payload: {
      gameId,
      x,
      y,
    },
  };
}

export function initInfo() {
  return {
    command: 'initInfo',
  };
}
