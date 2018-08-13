'use strict';

const ui = require('cliui')();
const chalk = require('chalk');
const log = console.log;

function printOutput() {
  log(ui.toString());
  ui.resetOutput();
};

const showError = (error) => {
  ui.div({
    text: chalk.grey(error),
    align: 'right',
  });

  printOutput();
};

const showMessage = (message) => {
  ui.div({
    text: message,
    align: 'right',
  });

  printOutput();
};

module.exports = {

  openingText: () => {
    ui.div({
      text: chalk.green('Welcome in TicTacToe client'),
      align: 'center',
    });

    ui.div({
      text: 'To join the server please type `join`',
    })

    ui.div({
      text: 'To listing possible commands, type `help`',
    });

    printOutput();
  },

  clientConnected: () => {
    ui.div({
      text: chalk.green('Client connected to server successfully'),
    })

    printOutput();
  },

  joinFirst: () => {
    ui.div({
      text: chalk.red('First you need to join to the server with the `join` command'),
    });

    printOutput();
  },

  alreadyConnected: () => {
    ui.div({
      text: chalk.red('Already connected to the server'),
    });

    printOutput();
  },

  help: () => {
    ui.div({
      text: 'Commands:',
      padding: [2,0,2,0],
    });

    ui.div({
      text: "help",
      width: 20,
      padding: [0, 4, 0, 4],
    }, {
      text: "Print commands"
    });

    ui.div({
      text: "getLobby",
      width: 20,
      padding: [0, 4, 0, 4],
    }, {
      text: "list players from server"
    });

    ui.div({
      text: "gameWith",
      width: 20,
      padding: [0, 4, 0, 4],
    }, {
      text: "Start a game with someone"
    }, {
      text: chalk.bold('gameWith [nickName|id]')
    });

    ui.div({
      text: "draw",
      width: 20,
      padding: [0, 4, 0, 4],
    }, {
      text: "draw your symbol to board"
    }, {
      text: chalk.bold('draw [column] [row]')
    });

    ui.div({
      text: "gameList",
      width: 20,
      padding: [0, 4, 0, 4],
    }, {
      text: "get back gameList"
    }, {
      text: chalk.bold('gameList')
    });

    ui.div({
      text: "spec",
      width: 20,
      padding: [0, 4, 0, 4],
    }, {
      text: "Be a spectator in a game"
    }, {
      text: chalk.bold('spec [gameId]')
    });


    printOutput();
  },

  badCommand: () => {
    ui.div({
      text: chalk.red('Command is not supported, please use `help` for listing commands'),
    })

    printOutput();
  },

  exitText: () => {
    ui.div({
      text: chalk.green('Thank you for playing the game.'),
    })

    printOutput();
  },

  showError,
  showMessage,

  printLobby: (lobby) => {
    if (lobby.length <= 0) {
      showMessage('Lobby is empty');
    } else {
      ui.div({
        text: chalk.green('The lobby'),
        align: 'center',
        padding: [2,0,2,0],
      })
      lobby.forEach((item) => {
        ui.div({
          text: `nickName: ${chalk.bold(item.nickName)}`,
        }, {
          text: `id: ${chalk.italic(item.id)}`,
        });
      });
      ui.div({
        text: 'Select player with `gameWith guestName` command',
        align: 'center',
        padding: [1,0,2,0],
      })
    }

    printOutput();
  },

  initBoard(inputBoard) {
    let board = Object.assign(inputBoard);
    board = board.map(row => {
      return row.map(item => {
        return item === 0 ? ' ' : item;
      });
    });
    ui.div({
      text: chalk.green('The Board'),
      padding: [1,0,1,0],
      align: 'center'
    })
    ui.div({
      text: ' 1  2  3 ',
      align: 'center',
    });
    ui.div({
      text: '~~~~~~~~~~~~~',
      align: 'center',
    });
    ui.div({
      text: `1 | ${board[0][0]} | ${board[0][1]} | ${board[0][2]} |`,
      align: 'center',
    });
    ui.div({
      text: `2 | ${board[1][0]} | ${board[1][1]} | ${board[1][2]} |`,
      align: 'center',
    });
    ui.div({
      text: `3 | ${board[2][0]} | ${board[2][1]} | ${board[2][2]} |`,
      align: 'center',
    });
    ui.div({
      text: '~~~~~~~~~~~~~',
      align: 'center',
    });
    ui.div({
      text: '- - - - - - - - - - -',
      padding: [1,0,1,0],
      align: 'center',
    });

    printOutput();
  },

  nextMove(current, next) {
    if(current === next) {
      ui.div({
        text: 'It is your turn, make a move',
      });
    } else {
      ui.div({
        text: 'Opponent turn, wait for it',
      });
    }

    printOutput();
  },

  printGameList(gameList) {
    if (gameList.length <= 0) {
      showMessage('There are no running games');
    } else {
      ui.div({
        text: chalk.green('Gamelist'),
        align: 'center',
        padding: [1,0,1,0],
      });

      ui.div({
        text: chalk.bold('Game ID'),
        width: 20,
        align: 'center',
      }, {
        text: chalk.bold('Players'),
      })
      gameList.forEach((game) => {
        ui.div({
          text: game.id,
          width: 20,
          align: 'center'
        }, {
          text: game.players.join(','),
        });
      })
      
    }

    printOutput();
  }
};