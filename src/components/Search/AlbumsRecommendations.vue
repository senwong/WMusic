<template>
  <section class="recommendation-section">
    <div class="title">专辑</div>
    <ul>
      <li v-for="album in albums" :key="album.id">
        <RouterLink class="item" :to="'/album/' + album.id">
          <span class="item-title">
            {{ album.name }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Album } from "@/types";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";

@Component({
  components: { ArtistsWithComma }
})
export default class Albums extends Vue {
  @Prop() albums!: Album[];
}
</script>

<style lang="sass" scoped>
@import "./recommendations.sass"
</style>
