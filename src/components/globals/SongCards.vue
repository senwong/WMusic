<template>
<div class="lists">
  <card-item v-for="card in cardLists" :key="card.id" :card="card" :cardType="cardType">
  </card-item>
</div>
</template>
<script>
import CardItem from './CardItem.vue';

export default {
  name: "SongCards",
  props: ['cardLists', 'cardType'],
  components: {CardItem, },
}
</script>
<style lang="sass" scoped>
.lists
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
</style>

