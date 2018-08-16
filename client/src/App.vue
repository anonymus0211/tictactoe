<template>
  <div id="app">
    <user-info :user="user"></user-info>
    <b-container fluid>
      <b-row>
        <b-col>
          
          <b-row v-if="!inGame">
            <b-col cols=6>
              <lobby 
                :users="lobby" 
                :update="updateLobby"
                :startGame="startGame">
              </lobby>
            </b-col>
            <b-col cols=6>
              <game-list 
                :games="games" 
                :update="updateGameList"
                :spectate="spectateGame">
              </game-list>
            </b-col>
          </b-row>

          <game-board 
            v-else
            :game="currentGame"
            :makeStep="makeStep"
            :giveUp="giveUp"
            :player="user"
            :leaveSpec="leaveSpec">
            </game-board>
          
          <sys-log :text="syslogTexts" :clearAll="clearSyslog"></sys-log>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as tcpCommands from '@/helpers/tcpCommands';
import Socket from '@/services/socket';
import UserInfo from './components/UserInfo';
import Lobby from './components/Lobby';
import GameList from './components/GameList';
import GameBoard from './components/GameBoard';

import SysLog from './components/SysLog';

const defaultGame = {
  id: '',
  board: [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ],
  nextPlayer: '',
  isSpectator: false,
};

export default {
  name: 'app',
  components: {
    UserInfo,
    Lobby,
    SysLog,
    GameList,
    GameBoard,
  },

  data() {
    return {
      inGame: false,
      syslog: [],
      lobby: [],
      games: [],
      user: {
        id: '',
        nickName: '',
      },
      currentGame: {
        id: '',
        board: [
          ['X', 'O', 'X'],
          ['X', ' ', ' '],
          [' ', ' ', ' '],
        ],
        nextPlayer: '',
        isSpectator: true,
      },
    };
  },

  created() {
    Socket.$on('message', this.handleMessage);
    if (Socket.isReady() && !this.user.id) {
      Socket.send(tcpCommands.initInfo());
      Socket.send(tcpCommands.getLobby());
      Socket.send(tcpCommands.gameList());
    }
  },

  beforeDestroy() {
    Socket.$off('message', this.handleMessage);
  },

  methods: {
    clearSyslog() {
      this.syslog = [];
    },
    updateLobby() {
      Socket.send(tcpCommands.getLobby());
    },
    updateGameList() {
      Socket.send(tcpCommands.gameList());
    },
    startGame(user) {
      Socket.send(tcpCommands.gameWith(user.nickName));
    },
    spectateGame(game) {
      Socket.send(tcpCommands.spec(game.id));
    },
    leaveSpec(game) {
      Socket.send(tcpCommands.leaveSpec(game.id));
    },
    makeStep(gameId, x, y) {
      Socket.send(tcpCommands.draw(gameId, x, y));
    },
    giveUp(game) {
      Socket.send(tcpCommands.giveUp(game.id));
    },
    handleMessage(message) {
      try {
        const data = JSON.parse(message);
        // this.syslog.push(JSON.stringify(data, null, 2));
        if (data.error) {
          this.syslog.push(`Error: ${data.error}`);
        }
        switch (data.command) {
          case 'sysMessage':
            this.syslog.push(data.data);
            break;
          case 'initInfo':
            this.user = data.data;
            break;
          case 'getLobby':
            this.lobby = data.data;
            break;
          case 'gameList':
            this.games = data.data;
            break;
          case 'gameBoard':
            this.inGame = true;
            this.currentGame = data.data;
            break;
          case 'backToLobby':
            this.inGame = false;
            this.currentGame = defaultGame;
            this.updateLobby();
            this.updateGameList();
            break;
          case 'gameSpec':
            this.inGame = true;
            this.currentGame = data.data;
            break;
          default:
            break;
        }
      } catch (error) {
        this.syslog.push(error.message);
      }
    },
  },

  computed: {
    syslogTexts() {
      return this.syslog.join('\n');
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

  .jumbotron {
    padding: 2rem 1rem!important;
  }
  .jumbotron h1 {
    font-size: 2.5rem;
    text-align: left;
  }
</style>
