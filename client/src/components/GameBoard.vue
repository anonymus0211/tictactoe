<template>
  <b-row>
    <b-col>
      <b-jumbotron header="Game board" :lead="lead">
        <b-row v-for="(row, rowIndex) in game.board" :key='rowIndex'>
          <b-col cols=5></b-col>
          <b-col cols=2>
            <b-row>
              <b-col 
                v-for="(column, colIndex) in row"
                cols="4"
                :key="[colIndex, rowIndex].join()">
                  <b-button 
                    size="lg" 
                    @click="makeStep(game.id, colIndex+1, rowIndex+1)"
                    :disabled="game.isSpectator || column !== 0 || game.nextPlayer !== player.id">
                    {{column === 0 ? ' ' : column}}
                  </b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols=5></b-col>
        </b-row>
        <b-button v-if="!game.isSpectator" variant="primary" @click.prevent="giveUp(game)">Give Up!</b-button>
        <b-button v-else variant="primary" @click.prevent="leaveSpec(game)">Leave Game!</b-button>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'gameBoard',
  props: ['game', 'makeStep', 'player', 'giveUp', 'leaveSpec'],
  methods: {

  },
  data() {
    return {

    };
  },

  computed: {
    lead() {
      return `Game: ${this.game.id}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  [type="button"] {
    min-width: 2.5em;
    min-height: 2.5em;
    margin-bottom: 2em;
  }

  
</style>
