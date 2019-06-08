<template>
  <div class="top-list">
    <div class="container">
      <OfficialTopList />
      <div class="domestic-top-list">
        <MediaItem
          v-for="typeId in domesticTypeIds"
          :key="typeId"
          :typeId="typeId"
        />
      </div>
      <div class="international-top-list__wrapper">
        <h3>全球媒体榜</h3>
        <div class="international-top-list">
          <CardItem
            v-for="typeId in internationalTypeIds"
            :key="typeId"
            :typeId="typeId"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getTopList } from "@/service";
import CardItem from "@/components/TopList/CardItem.vue";
import MediaItem from "@/components/TopList/MediaItem.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import { PlaylistType, Track, TabMenuItem, Artist } from "@/types";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import TabMenu from "@/components/globals/TabMenu.vue";

import Button from "@/components/globals/Button.vue";
import { Mutation, namespace } from "vuex-class";
import OfficialTopList from "./OfficialTopList.vue";

const playlist = namespace("playlist");

interface Card {
  id: number;
  name: string;
  type: PlaylistType;
  picUrl: string;
}

const topListMap = {
  "0": "云音乐新歌榜", // 云音乐
  1: "云音乐热歌榜", // 云音乐
  "2": "网易原创歌曲榜", // 云音乐
  "3": "云音乐飙升榜",
  4: "云音乐国电榜",
  5: "UK排行榜周榜", // 国际榜
  6: "美国Billboard周榜", // 国际榜
  "7": "KTV唛榜",
  8: "iTunes榜", // 国际榜
  "9": "Hit FM Top榜",
  10: "日本Oricon周榜", // 国际榜
  11: "韩国Melon排行榜周榜", // 国际榜
  "12": "韩国Mnet排行榜周榜", // 国际榜
  "13": "韩国Melon原声周榜", // 国际榜
  14: "中国TOP排行榜（港台榜）",
  15: "中国TOP排行榜（内地榜）",
  16: "香港电台中文歌曲龙虎榜", // 国际榜
  "17": "华语金曲榜",
  18: "中国嘻哈榜",
  19: "法国 NRJ Vos Hits 周榜",
  20: "台湾Hito排行榜", // 国际榜
  "21": "Beatport全球电子舞曲榜", // 国际榜
  "22": "云音乐ACG音乐榜",
  "23": "江小白YOLO云音乐说唱榜"
};

enum Type {
  New,
  Hot,
  Origin
}
interface TopListType {
  id: number;
  name: string;
  picUrl: string;
  tracks: Track[];
}
interface OfficialConntent {
  id: number;
  title: string;
  picUrl: string;
  tracks: Track[];
}

@Component({
  components: {
    CardItem,
    MediaItem,
    ImageWithPlaceholder,
    TabMenu,
    Button,
    OfficialTopList
  }
})
export default class TopList extends Vue {
  domesticTypeIds: number[] = [3, 4, 7, 9, 14, 15, 17, 18, 19, 22, 23];

  internationalTypeIds: number[] = [
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21
  ];
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
@import '@/style/colors.sass'

.top-list
  padding: 0 1em
.ellipsis
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis
// 国内媒体榜
.domestic-top-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))
  grid-gap: 2em
  flex-wrap: wrap
  justify-content: space-between
  margin-top: 2em
// 国际媒体榜
.international-top-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
  grid-gap: 2em
  flex-wrap: wrap
  justify-content: space-between
  margin-top: 2em
</style>
