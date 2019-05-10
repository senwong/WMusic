<template>
  <section class="recommendation-section">
    <div class="title">单曲</div>
    <ul>
      <li v-for="song in songs" :key="song.id" class="list-item">
        <RouterLink class="item" :to="'/song/' + song.id">
          <span class="item-title">
            {{ song.name }} -&nbsp;
            <ArtistsWithComma :artists="song.artists" class="artists"/>
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Track } from "@/types";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";

@Component({
  components: { ArtistsWithComma }
})
export default class Songs extends Vue {
  @Prop() songs!: Track[];
}
</script>

<style lang="sass" scoped>
@import "./recommendations.sass"
.artists
  display: inline-block
</style>
