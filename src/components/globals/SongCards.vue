<template>
<div class="lists">
  <CardItem v-for="card in cardLists" :key="card.id" :card="card" :cardType="cardType" />
</div>
</template>
<script lang='ts'>
import CardItem from './CardItem.vue';
import { Playlist, PlaylistType } from '@/types';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { CardItem }
})
export default class SongCards extends Vue {
  @Prop() readonly cardType!: PlaylistType
  @Prop() readonly cardLists!: Playlist[]
}
</script>
<style lang="sass" scoped>
.lists
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
  gap: 2em
  flex-wrap: wrap
  justify-content: space-between
</style>

