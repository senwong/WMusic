<template>
  <SearchRecList title="艺人">
    <template>
      <SearchRecItem
        v-for="artist in artists"
        :key="artist.id"
        :to="'/artist/' + artist.id"
      >
        {{ artist.name }}
      </SearchRecItem>
    </template>
  </SearchRecList>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Artist } from "@/types";
import SearchRecList from "./RecList.vue";
import SearchRecItem from "./RecItem.vue";

@Component({
  components: { SearchRecList, SearchRecItem }
})
export default class Artists extends Vue {
  @Prop() artists!: Artist[];
}
</script>

<style lang="sass" scoped>
</style>
