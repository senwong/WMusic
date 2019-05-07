<template>
  <section class="recommendation-section">
    <div class="title">歌单</div>
    <ul>
      <li v-for="playlist in playlists" :key="playlist.id">
        <RouterLink :to="'/playlist/' + playlist.id" class="item">
          <img
            class="playlist-img"
            :src="playlist.picUrl | clipImage(100, 100)"
            :alt="playlist.name"
          />
          <span class="item-title">
            {{ playlist.name }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Playlist } from "@/types";

@Component
export default class Playlists extends Vue {
  @Prop() playlists!: Playlist[];
}
</script>

<style lang="sass" scoped>
@import "./recommendations.sass"
</style>
