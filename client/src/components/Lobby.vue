<template>
  <b-row>
    <b-col>
      <b-jumbotron header="Lobby" lead="Users lobby">
        <p v-if="users.length <= 0">Lobby is currently empty!</p>
        <b-table 
          v-else 
          small 
          hover 
          :items="users" 
          :fields="fields">

          <template slot="actions" slot-scope="row">
            <b-button size="sm" variant="success" @click.stop="startGame(row.item)" class="mr-1">
              Start Game
            </b-button>
       
          </template>
        </b-table>
        <b-button variant="primary" @click.prevent="update">Update Lobby</b-button>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'lobby',
  props: ['users', 'update', 'startGame'],
  methods: {
    clicked(item) {
      console.log(item.id);
    },
  },
  data() {
    return {
      fields: [
        { key: 'nickName' },
        { key: 'id' },
        { key: 'actions', label: 'Actions' },
      ],
    };
  },
};
</script>

<style scoped>
</style>
