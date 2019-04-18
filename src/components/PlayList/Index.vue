<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="category__selected">
        <span class="category__title">{{selected}}</span>
        <span class="category__toggle__btn" @click="showMenu=!showMenu">
          <ChevronTopIcon class="category__title__icon" v-show="!showMenu"  />
          <ChevronBottomIcon class="category__title__icon" v-show="showMenu"  />
        </span>
      </div>
      <transition name="move" @after-enter="afterEnter" @before-leave="beforeLeave">
        <div class="category__list-wrapper" v-show="showMenu">
          <div class="category__list-container">
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
                  v-for="(c, i) in sub.filter(c => c.category == categoryKey)" :key="i"
                  @click="selectCat(c.name)"
                >{{c.name}}</span>
              </div>
              <hr>
            </div>
          </div>
        </div>
      </transition>
      <div v-show="showCards">
        <ul class="category__order">
          <li class="order__item active" data-order="hot">最热</li>
          <li class="order__item" data-order="new">最新</li>
        </ul>
        <song-cards :cardLists="playlists" :cardType="'PLAYLIST'"></song-cards>
        <ul class="pagination">
          <li
            class="pagination__item"
            v-for="(pageNum, i) in pagination" :key="i"
            @click="offset = pageNum - 1"
            :class="{'active': offset == pageNum - 1}"
          >
            {{pageNum}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getPlayListCatlist, getPlayList } from '@/service/Service';
import {convertToHttps} from '@/utilitys';
import SongCards from '@/components/globals/SongCards';
import ChevronTopIcon from '@/components/SVGIcons/ChevronTopIcon';
import ChevronBottomIcon from '@/components/SVGIcons/ChevronBottomIcon';

export default {
  name: "PlayListIndex",
  components: { SongCards, ChevronTopIcon, ChevronBottomIcon, },
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
        alert("获取歌单分类失败： " + res.data)
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
      getPlayList(this.selected, this.order, this.offset*20 ).then(res => {
        res = convertToHttps(res)
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
          alert("获取歌单失败： " + res.data)
        }
      })
    },
    selectCat(newCat) {
      this.selected = newCat
      this.showMenu = false
    },
    isPageNum(pageIdx) {
      return pageIdx == 0
        || pageIdx == this.pageCount - 1
        || (pageIdx < this.offset + 2 && pageIdx > Math.max(0, this.offset - 3));
    },
    isPageSpread(pageIdx) {
      return pageIdx == this.offset + 2 || pageIdx ==  Math.max(0, this.offset - 3);
    }
  },
  computed: {
    pageCount() {
      return Math.floor(this.total / 20)
    },
    pagination() {
      const result = [];
      new Array(this.pageCount).fill(true).map((_, idx) => {
        if (this.isPageNum(idx)) {
          result.push(idx + 1);
        } else if (this.isPageSpread(idx)) {
          result.push('...');
        }
      });
      return result;
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
.category__toggle__btn
  cursor: pointer;
.category__title, .category__title__icon
  vertical-align: middle;
.category__title__icon
  width: 0.5em;
  height: 0.5em;
.category__list-wrapper
  position: relative;
.category__list-container
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
  cursor: pointer;
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
  cursor: pointer;
  &.active
    color: $orange;
</style>
