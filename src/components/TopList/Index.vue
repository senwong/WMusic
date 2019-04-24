<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="offical">
        <div>
          <ul class="tabs">
            <li
              class="tab"
              v-for="(title, i) in Object.keys(officalList)"
              :key="officalList[title] && officalList[title].id || i"
              :class="{'active': selected==i}"
              @click="selected=i"
            >{{title}}</li>
          </ul>
          <div class="tab-contents">
            <div
              class="tab__content card"
              v-for="(title, i) in Object.keys(officalList)"
              :key="officalList[title] && officalList[title].id || i"
              v-show="selected==i"
            >
              <div class="card__left">
                <ImageWithPlaceholder
                  :src="officalList[title].coverImgUrl | convert2Https | clipImage(400, 400)"
                  :alt="title"
                  ratio="1:1"
              />
              </div>
              <div class="card__right">
                <div class="table-head">
                  <span class="text-center"></span>
                  <span @click="playAll(officalList[title].id)">全部播放</span>
                  <span></span>
                  <router-link :to="'/playlist/'+officalList[title].id">全部</router-link>
                </div>
                <ul class="table-body">
                  <li class="table-row" v-for="(track, i) in officalList[title].tracks" :key="track.id">
                    <span class="text-center">0{{i+1}}</span>
                    <router-link :to="'/song/'+track.id">{{track.name}}</router-link>
                    <span>{{track.ar.map(ar => ar.name).join("; ")}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="media-container others">
        <media-item
            v-for="key in  Object.keys(otherList)"
            :key="otherList[key] && otherList[key].id"
            :card="otherList[key]"
            cardType="playlist"
        ></media-item>
      </div>
      <div class="internation">
        <h3>全球媒体榜</h3>
        <div class="card-container">
          <card-item
            v-for="key in  Object.keys(internationalList)"
            :key="internationalList[key] && internationalList[key].id"
            :card="internationalList[key]"
            cardType="playlist"
          ></card-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTopList } from "@/service";
import CardItem from "@/components/TopList/CardItem";
import MediaItem from "@/components/TopList/MediaItem";
import ImageWithPlaceholder from '@/components/globals/ImageWithPlaceholder';
const topListMap = {
  "0": "云音乐新歌榜", // 云音乐
  "1": "云音乐热歌榜", // 云音乐
  "2": "网易原创歌曲榜", // 云音乐
  "3": "云音乐飙升榜",
  "4": "云音乐国电榜",
  "5": "UK排行榜周榜",            // 国际榜
  "6": "美国Billboard周榜",      // 国际榜
  "7": "KTV唛榜",
  "8": "iTunes榜",              // 国际榜
  "9": "Hit FM Top榜",
  "10": "日本Oricon周榜",        // 国际榜
  "11": "韩国Melon排行榜周榜",    // 国际榜
  "12": "韩国Mnet排行榜周榜",     // 国际榜
  "13": "韩国Melon原声周榜",      // 国际榜
  "14": "中国TOP排行榜（港台榜）",
  "15": "中国TOP排行榜（内地榜）",
  "16": "香港电台中文歌曲龙虎榜",   // 国际榜
  "17": "华语金曲榜",
  "18": "中国嘻哈榜",
  "19": "法国 NRJ Vos Hits 周榜",
  "20": "台湾Hito排行榜",         // 国际榜
  "21": "Beatport全球电子舞曲榜",  // 国际榜
  "22": "云音乐ACG音乐榜",
  "23": "江小白YOLO云音乐说唱榜",
}
export default {
  name: "TopList",
  components: {CardItem, MediaItem,ImageWithPlaceholder },
  data() {
    return {
      tabs: ["热歌", "新歌", "原创"],
      selected: 0,
      officalList: {
        "热歌": {id: "", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "新歌": {id: "", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "原创": {id: "", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]}
      },
      internationalList: {
        "美国Billboard周榜": {id: "0", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},       // 国际榜
        "iTunes榜":     {id: "1", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},          // 国际榜
        "日本Oricon周榜":   {id: "2", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},      // 国际榜
        "韩国Melon排行榜周榜": {id: "3", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},    // 国际榜
        "韩国Mnet排行榜周榜":  {id: "4", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},    // 国际榜
        "韩国Melon原声周榜":  {id: "5", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},     // 国际榜
        "香港电台中文歌曲龙虎榜":  {id: "6", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},  // 国际榜
        "台湾Hito排行榜":   {id: "7", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},       // 国际榜
        "Beatport全球电子舞曲榜": {id: "8", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},  // 国际榜
      },
      // internationalList: {},
      otherList: {
        "云音乐飙升榜": {id: "0", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "云音乐国电榜": {id: "1", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "KTV唛榜": {id: "2", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "Hit FM Top榜": {id: "3", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "中国TOP排行榜（港台榜）": {id: "4", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "中国TOP排行榜（内地榜）": {id: "5", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "华语金曲榜": {id: "6", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "中国嘻哈榜": {id: "7", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "法国 NRJ Vos Hits 周榜": {id: "8", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "云音乐ACG音乐榜": {id: "9", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
        "江小白YOLO云音乐说唱榜": {id: "10", name: "", coverImgUrl: "", tracks: [{id: "", name: "", ar: [],}]},
      }
    }
  },
  created() {
    const listMap = {"0": "新歌", "1": "热歌", "2": "原创"}
    this.getList(listMap, this.officalList)

    const internationMap = {
      "6": "美国Billboard周榜",      // 国际榜
      "8": "iTunes榜",              // 国际榜
      "10": "日本Oricon周榜",        // 国际榜
      "11": "韩国Melon排行榜周榜",    // 国际榜
      "12": "韩国Mnet排行榜周榜",     // 国际榜
      "13": "韩国Melon原声周榜",      // 国际榜
      "16": "香港电台中文歌曲龙虎榜",   // 国际榜
      "20": "台湾Hito排行榜",         // 国际榜
      "21": "Beatport全球电子舞曲榜",  // 国际榜
    }
    this.getList(internationMap, this.internationalList)
    const otherMap = {
      "3": "云音乐飙升榜",
      "4": "云音乐国电榜",
      "7": "KTV唛榜",
      "9": "Hit FM Top榜",
      "14": "中国TOP排行榜（港台榜）",
      "15": "中国TOP排行榜（内地榜）",
      "17": "华语金曲榜",
      "18": "中国嘻哈榜",
      "19": "法国 NRJ Vos Hits 周榜",
      "22": "云音乐ACG音乐榜",
      "23": "江小白YOLO云音乐说唱榜",
    }
    this.getList(otherMap, this.otherList)

  },
  mounted() {
    this.$el.querySelectorAll(".tabs .tab").forEach(tab => {
      tab.addEventListener("click", e => {
        this.$el.querySelector(".tabs .tab.active").classList.remove("active")
        tab.classList.add("active")
      })
    })
  },
  methods: {
    playAll(topListId) {
      this.$store.dispatch("playAllList", {type: "PLAYLIST", id: topListId})
    },
    // const listMap = {"0": "新歌", "1": "热歌", "2": "原创"}
    getList(listMap, destination) {
      Object.keys(listMap).forEach(key => {
        const value = listMap[key]
        getTopList(key).then(res => {
          if(res.data.code == 200) {
            ({
              id: destination[value].id,
              name: destination[value].name,
              coverImgUrl: destination[value].coverImgUrl,
            } = res.data.playlist)
            destination[value].coverImgUrl = destination[value].coverImgUrl.replace(/http:\/\//g, "https://")
            destination[value].tracks = res.data.playlist.tracks.slice(0, 5).map(track => {
              return {
                id: track.id,
                name: track.name,
                ar: track.ar.map(ar => {return{ id: ar.id, name: ar.name }})
              }
            })
          }else {
            console.warn("获取榜单错误： "+res.data)
          }
        })
      })
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.offical
  background-color: $gray2;
  margin: 0 -2em;
  padding: 2em;
.tabs
  padding: 0
.tab
  display: inline-block;
  list-style: none;
  border-bottom: 2px solid transparent;
  margin-right: 2em;
  padding-bottom: 0.25em;
  &.active
    color: $orange;
    border-bottom: 2px solid $orange;
  &:hover
    color: $orange;
.tab-contents
  position: relative;
  height: 200px;
.tab__content
  position: absolute;
  left: 0;
  top: 0;
  right: 0;

.card
  display: flex;
  justify-content: space-between;
  background-color: inherit;
  img
    width: 200px;
    height: 200px;
    // transform: rotate3d(0, 1, 0, 45deg);
.card__left
  flex: 0 0 10em;
  margin-right: 2em;
.card__right
  flex: 1 1 auto;
.table-row, .table-head
  display: grid;
  grid-template-columns: 2em 1fr 1.5fr 4em;
  padding: 0.3em 0.5em;
  font-size: 14px;
.table-body
  padding: 0;
  margin: 0;
.text-center
  text-align: center
.text-left
  text-align: left
.table-row
  background-color: $whitegray6;
  &:nth-of-type(2n)
    background-color: $gray2;
  &:hover
    background-color: $whitegray7;
.others
  margin-top: 40px;
// 国际媒体榜
.card-container
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
.media-container
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
</style>

