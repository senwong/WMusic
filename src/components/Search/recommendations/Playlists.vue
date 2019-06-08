<template>
  <SearchRecList title="歌单">
    <template>
      <SearchRecItem
        v-for="playlist in playlists"
        :key="playlist.id"
        :to="'/playlist/' + playlist.id"
      >
        <template>
          <img
            class="search-rec-playlist-img"
            :src="playlist.picUrl | clipImage(100, 100)"
            :alt="playlist.name"
          />
          <span>
            {{ playlist.name }}
          </span>
        </template>
      </SearchRecItem>
    </template>
  </SearchRecList>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Playlist } from "@/types";
import SearchRecList from "./RecList.vue";
import SearchRecItem from "./RecItem.vue";

@Component({
  components: { SearchRecList, SearchRecItem }
})
export default class Playlists extends Vue {
  @Prop() playlists!: Playlist[];
}
</script>

<style lang="sass" scoped>
.search-rec-playlist-img
  width: 2em
  height: 2em
  border-radius: 4px
  margin-right: 9px
</style>
