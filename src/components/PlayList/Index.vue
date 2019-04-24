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
        <TabMenu
          align-left
          :list="[
            {key: 1, title: '最热', onClick: () => orderType='hot', isActive: orderType == 'hot' },
            {key: 2, title: '最新', onClick: () => orderType='new', isActive: orderType == 'new' },
          ]"
        />
        <song-cards :cardLists="playlists" :cardType="'playlist'" class="song-cards"/>
        <Pagination :total="pageTotal" @change="handlePageChange" />
      </div>
    </div>
  </div>
</template>
<script>
import { getPlayListCatlist, getPlayList } from '@/service';
import SongCards from '@/components/globals/SongCards';
import ChevronTopIcon from '@/components/SVGIcons/ChevronTopIcon';
import ChevronBottomIcon from '@/components/SVGIcons/ChevronBottomIcon';
import Pagination from '@/components/globals/Pagination';
import TabMenu from '@/components/globals/TabMenu';

export default {
  name: "PlayListIndex",
  components: {
    SongCards,
    ChevronTopIcon,
    ChevronBottomIcon,
    Pagination,
    TabMenu,
  },
  data() {
    return {
      categories: {},
      sub: [],
      selected: "全部",
      showMenu: false,
      orderType: "hot",
      playlists: [],
      total: 0,
      offset: 0,
      showCards: true,
      limit: 20,
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
    this.updatePlayList()
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
    updatePlayList() {
      getPlayList(this.selected, this.orderType, this.offset ).then(res => {
        if(res.data.code == 200) {
          this.total = res.data.total
          this.playlists = res.data.playlists.map(list => {
            return {
              id: list.id,
              picUrl: list.coverImgUrl,
              name: list.name,
              publishTime: list.updateTime,
              playCount: list.playCount,
              creator: list.creator,
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
    handlePageChange(currentPageidx) {
      this.offset = this.limit * currentPageidx;
      this.updatePlayList();
    },
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.limit);
    },
  },
  watch: {
    selected(val) {
      this.offset = 0
      this.updatePlayList();
    },
    orderType(val) {
      this.offset = 0;
      this.updatePlayList();
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


.song-cards
  margin-top: 2em;
</style>
