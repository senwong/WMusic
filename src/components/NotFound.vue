<template>
  <div class="not-found">404 Not Found</div>
</template>

<script lang='ts'>
import { Vue } from "vue-property-decorator";
export default class NotFound extends Vue {}
</script>

<style lang="sass" scoped>
.not-found
  font-size: 4em
  margin-top: 2em
  text-align: center
  color: #777
  font-family: fantasy
</style>
