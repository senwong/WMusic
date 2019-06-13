<template>
  <div class="sublist">
    <TabMenu class="sublist__nav" align-left is-link :list="navList" />
    <router-view class="sublist__content" />
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
  navList: TabMenuItem[] = [
    {
      key: 0,
      title: "专辑",
      href: `/sublist/`
    },
    {
      key: 1,
      title: "歌手",
      href: `/sublist/artist`
    },
    {
      key: 2,
      title: "MV",
      href: `/sublist/mv`
    }
  ];

  get currentComponent(): SubListComponentName {
    return typeComponents[this.currentType];
  }
}
</script>

<style lang="sass" scoped>
.sublist
  font-size: 16px
  padding: 1em
.sublist__content
  margin-top: 2em
</style>
