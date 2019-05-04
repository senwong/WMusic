<template>
  <section class="recommendation-section">
    <div class="title">MV</div>
    <ul>
      <li v-for="mv in mvs" :key="mv.id">
        <RouterLink :to="'/mvplay/'+ mv.id" class="item">
          <span class="item-title">
            {{mv.name}}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MvCard } from '@/types';

@Component
export default class Mvs extends Vue {
  @Prop() mvs!: MvCard[];
}
</script>

<style lang='sass' scoped>
@import "./recommendations.sass"
</style>
