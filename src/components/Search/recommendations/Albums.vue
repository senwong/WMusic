<template>
  <SearchRecList title="专辑">
    <template>
      <SearchRecItem
        v-for="album in albums"
        :key="album.id"
        :to="'/album/' + album.id"
      >
        {{ album.name }} - {{ album.artist && album.artist.name }}
      </SearchRecItem>
    </template>
  </SearchRecList>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Album } from "@/types";
import SearchRecList from "./RecList.vue";
import SearchRecItem from "./RecItem.vue";

@Component({
  components: { SearchRecList, SearchRecItem }
})
export default class Albums extends Vue {
  @Prop() albums!: Album[];
}
</script>

<style lang="sass" scoped></style>
