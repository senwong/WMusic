<template>
  <section class="recommendation-section">
    <div class="title">艺人</div>
    <ul>
      <li v-for="artist in artists" :key="artist.id">
        <RouterLink class="item" :to="'/artist/' + artist.id">
          <img
            class="artist-avatar"
            :src="artist.img1v1Url | clipImage(200, 200)"
            :alt="artist.name"
          />
          <span class="item-title">
            {{artist.name}}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Artist } from '@/types';

@Component
export default class Artists extends Vue {
  @Prop() artists!: Artist[];
}
</script>

<style lang='sass' scoped>
@import "./recommendations.sass"
</style>
