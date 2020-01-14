<template>
  <div class="repo">
      name: {{this.name}}
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Repo',
  data() {
      return {
      }
  },
  props: {
    name: String
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
