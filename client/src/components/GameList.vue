<template>
  <b-row>
    <b-col>
      <b-jumbotron header="Game list" lead="Current games are online">
        <p v-if="games.length <= 0">There are no games running now!</p>
        <b-table 
          v-else 
          small 
          hover 
          :items="games" 
          :fields="fields">
          <template slot="actions" slot-scope="row">
            <b-button size="sm" variant="success" @click="spectate(row.item)">Spectate</b-button>
          </template>
        </b-table>
        <b-button variant="primary" @click.prevent="update">Update GameList</b-button>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'gameList',
  props: ['games', 'update', 'spectate'],
  data() {
    return {
      fields: [
        { key: 'id' },
        { key: 'players' },
        { key: 'actions', label: 'Actions' },
      ],
    };
  },
};
</script>

<style scoped>
</style>
