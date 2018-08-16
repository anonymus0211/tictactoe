<template>
  <b-jumbotron header="System logs" lead="System related messages">
    <b-form-textarea id="syslog"
      :value="text"
      plaintext
      :rows="5"
      :max-rows="5">
    </b-form-textarea>
    <b-button variant="primary" @click.prevent="clearAll">Clear logs</b-button>
  </b-jumbotron>
</template>

<script>
export default {
  name: 'lobby',
  props: ['text', 'clearAll'],
  data() {
    return {

    };
  },

  watch: {
    text() {
      this.$el.querySelector('textarea').scrollTop = this.$el.querySelector('textarea').scrollHeight;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
