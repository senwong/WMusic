<template>
  <SearchRecList title="MV">
    <template>
      <SearchRecItem v-for="mv in mvs" :key="mv.id" :to="'/mvplay/' + mv.id">
        {{ mv.name }} - {{ mv.artistName }}
      </SearchRecItem>
    </template>
  </SearchRecList>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MvCard } from "@/types";
import SearchRecList from "./RecList.vue";
import SearchRecItem from "./RecItem.vue";

@Component({
  components: { SearchRecList, SearchRecItem }
})
export default class Mvs extends Vue {
  @Prop() mvs!: MvCard[];
}
</script>

<style lang="sass" scoped>
</style>
