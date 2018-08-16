<template>
  <b-navbar toggleable="md" type="dark" variant="info">
  <b-navbar-brand href="#">TicTacToe</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item href="#">Nickname: {{user.nickName}}</b-nav-item>
      <b-nav-item href="#" disabled>({{user.id}})</b-nav-item>
    </b-navbar-nav>

 
  </b-navbar>
</template>

<script>
export default {
  name: 'userInfo',
  props: ['user'],
  data() {
    return {
    };
  },
};
</script>

<style scoped>
</style>
