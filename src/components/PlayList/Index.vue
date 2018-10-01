<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="category__selected">
        <span class="category__title">{{selected}}</span>
        <span @click="showMenu=!showMenu">
          <svg class="category__title__icon" v-show="!showMenu" id="i-chevron-top" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M30 20 L16 8 2 20" />
          </svg>
          <svg class="category__title__icon" v-show="showMenu" id="i-chevron-bottom" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M30 12 L16 24 2 12" />
          </svg>
        </span>
      </div>
      <div class="category__list-wrapper">
      <transition name="move" v-on:after-enter="afterEnter" v-on:before-leave="beforeLeave">
        <div class="category__list-container" v-show="showMenu">
          <div class="category__list">
            <span
              @click="selectCat('全部')"
              class="category__item"
              :class="{'active': selected=='全部'}"
            >全部</span>
          </div>
          <hr>
          <div
            v-for="categoryKey in Object.keys(categories)"
            :key="categoryKey"
          >
            <h3>{{categories[categoryKey]}}</h3>
            <div class="category__list">
              <span
                class="category__item"  
                :class="{'active': selected==c.name}"
                v-for="(c, i) in sub" :key="i"
                v-if="c.category == categoryKey"
                @click="selectCat(c.name)"
              >{{c.name}}</span>
            </div>
            <hr>
          </div>
        </div>
      </transition>
      </div>
      <div v-show="showCards">
        <ul class="category__order">
          <li class="order__item active" data-order="hot">最热</li>
          <li class="order__item" data-order="new">最新</li>
        </ul>
        <song-cards :cardLists="playlists" :cardType="'PLAYLIST'"></song-cards>
        <ul class="pagination">
          <li
            class="pagination__item"
            v-for="(_, i) in Array(pageCount)" :key="i"
            v-if="i==0 || (i == pageCount - 1) || (i < offset+2 && i > Math.max(0, offset - 3))"
            @click="offset=i"
            :class="{'active': offset==i}"
          >
            {{i + 1}}
          </li>
          <li
            class="pagination__item"
            :class="{'active': offset==i}"
            v-else-if="i == offset+2 || i ==  Math.max(0, offset - 3)"
            @click="offset=i"
          >...</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import { getPlayListCatlist, getPlayList } from '@/service/Service';
  import {convertToHttps} from '@/utilitys';
  import SongCards from '@/components/globals/SongCards';

  export default {
    name: "PlayListIndex",
    components: { SongCards },
    data() {
      return {
        categories: {},
        sub: [],
        selected: "全部",
        showMenu: false,
        order: "hot",
        playlists: [],
        total: 0,
        offset: 0,
        showCards: true,
      }
    },
    created() {
      getPlayListCatlist().then(res => {
        if(res.data.code == 200) {
          this.categories = res.data.categories
          this.sub = res.data.sub
        } else {
          console.warn("获取歌单分类失败： " + res.data)
        }
      })
      this.getPlayList()
    },
    methods: {
      afterEnter() {
        console.log("afterEnter")
        if (this.showMenu == true) {
          this.showCards = false
        }
      },
      beforeLeave() {
        console.log("beforeLeave")
        if (this.showCards == false) {
          this.showCards = true
        }
      },
      getPlayList() {
        console.log("getPlayList")
        getPlayList(this.selected, this.order, this.offset*20 ).then(res => {
          res = convertToHttps(res)
          res = JSON.parse(JSON.stringify(res).replace(/\.jpg/g, ".jpg?param=400y400"))
          if(res.data.code == 200) {
            this.total = res.data.total
            this.playlists = res.data.playlists.map(list => {
              return {
                id: list.id,
                picUrl: list.coverImgUrl,
                name: list.name,
                publishTime: list.updateTime,
                playCount: list.playCount,
                creatorName: list.creator.nickname,
              }
            })
          } else {
            console.warn("获取歌单失败： " + res.data)
          }
        })
      },
      selectCat(newCat) {
        this.selected = newCat
        this.showMenu = false
      }
    },
    computed: {
      pageCount() {
        return Math.floor(this.total / 20)
      }
    },
    watch: {
      offset(val) {
        this.getPlayList()
      },
      selected(val) {
        this.offset = 0
        this.getPlayList()
      },
      order(val) {
        this.offset = 0
        this.getPlayList()
      }
    },
    mounted() {
      this.$el.querySelectorAll(".order__item").forEach(item => {
        item.addEventListener("click", e => {
          const oldActive = this.$el.querySelector(".order__item.active")
          if(oldActive !== item) oldActive.classList.remove("active")
          item.classList.add("active")
          this.order = item.dataset.order
        })
      })
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass";

.category__selected
  position: relative;
  z-index: 2;
  font-size: 20px;
  padding: 2em 0 1em;
  margin-top: -1em;
  background-color: white;
.category__title
  margin-right: 0.5em;
.category__title, .category__title__icon
  vertical-align: middle;
.category__title__icon
  width: 0.5em;
  height: 0.5em;
.category__list-wrapper
  position: relative;
.category__list-container
  position: absolute;
  background-color: white;
  z-index: 1;
.category__sub
  display: none;
.category__list
  display: flex;
  flex-wrap: wrap;
.category__item
  font-size: 14px;
  margin: 1em 2em 1em 0;
  padding: 0.5em 1em;
  border-radius: 1.5em;
  background-color: $whitegray2;
  &.active
    color: white;
    background-color: $orange;
@keyframes move-down
  0%
    top: -1200px;
  100%
    top: 0px;
@keyframes move-up
  0%
    top: 0px;
  100%
    top: -1200px;
.move-enter-active
  animation: move-down 0.5s ease forwards;
.move-leave-active
  animation: move-up 0.5s ease forwards;

.category__order
  padding: 0;
  margin: 0 0 1em;
  border-bottom: 1px solid $whitegray2;
.order__item
  display: inline-block;
  border-bottom: 1px solid transparent;
  font-weight: bolder;
  margin: 1em 2em 0 0;
  padding: 0 0 0.7em;
  &.active
    border-bottom: 1px solid $orange;
    color: $orange;

.pagination
  padding: 0;
  text-align: center;
.pagination__item
  display: inline-block;
  margin: 1em;
  padding: 0.5em;
  &.active
    color: $orange;
</style>
