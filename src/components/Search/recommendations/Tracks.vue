<template>
  <SearchRecList title="单曲">
    <template>
      <SearchRecItem
        v-for="song in songs"
        :key="song.id"
        :to="'/song/' + song.id"
      >
        <span class="item-title">
          {{ song.name }} -&nbsp;
          <ArtistsWithComma :artists="song.artists" class="artists" />
        </span>
      </SearchRecItem>
    </template>
  </SearchRecList>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import SearchRecList from "./RecList.vue";
import SearchRecItem from "./RecItem.vue";

@Component({
  components: { ArtistsWithComma, SearchRecList, SearchRecItem }
})
export default class Songs extends Vue {
  @Prop() songs!: Track[];
}
</script>

<style lang="sass" scoped>

</style>
