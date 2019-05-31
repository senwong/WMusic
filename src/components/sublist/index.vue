<template>
  <div class="sublist__page-container">
    <TabMenu class="sublist__tab-menu" align-left :list="navList" />
    <component class="sublist__list" :is="currentComponent" />
  </div>
</template>

<script lang="ts">
import TabMenu from "@/components/globals/TabMenu.vue";
import AlbumSublist from "./albumSublist.vue";
import ArtistSublist from "./artistSublist.vue";
import MvSublist from "./mvSublist.vue";
import { Vue, Component } from "vue-property-decorator";
import { TabMenuItem } from "@/types";

// content type: 专辑: 0, 歌手: 1, MV: 2
enum ContentType {
  Album,
  Artist,
  Mv
}
const contentTypes = ["专辑", "歌手", "MV"];

type SubListComponentName = "AlbumSublist" | "ArtistSublist" | "MvSublist";
const typeComponents: SubListComponentName[] = [
  "AlbumSublist",
  "ArtistSublist",
  "MvSublist"
];
@Component({
  components: {
    TabMenu,
    AlbumSublist,
    ArtistSublist,
    MvSublist
  }
})
export default class SubList extends Vue {
  currentType: ContentType = ContentType.Album;

  get navList(): TabMenuItem[] {
    return contentTypes.map((title, idx) => ({
      key: idx,
      isActive: this.currentType == idx,
      onClick: () => (this.currentType = idx),
      title
    }));
  }

  get currentComponent(): SubListComponentName {
    return typeComponents[this.currentType];
  }
}
</script>

<style lang="sass" scoped>
.sublist__page-container
  font-size: 16px
.sublist__tab-menu
  margin-left: 2em
.sublist__list
  margin-top: 2em
</style>
