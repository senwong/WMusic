<template>
  <div class="main-wrapper">
    <div class="container">
      <div class="category__selected">
        <span class="category__title">{{ selected }}</span>
        <span class="category__toggle__btn" @click="showMenu = !showMenu">
          <ChevronTopIcon class="category__title__icon" v-show="!showMenu" />
          <ChevronBottomIcon class="category__title__icon" v-show="showMenu" />
        </span>
      </div>
      <transition name="move" @after-enter="afterEnter" @before-leave="beforeLeave">
        <div class="category__list-wrapper" v-show="showMenu">
          <div class="category__list-container">
            <div class="category__list">
              <span
                @click="selectCat('全部')"
                class="category__item"
                :class="{ active: selected == '全部' }"
                >全部</span
              >
            </div>
            <hr />
            <div v-for="categoryKey in Object.keys(categories)" :key="categoryKey">
              <h3>{{ categories[categoryKey] }}</h3>
              <div class="category__list">
                <span
                  class="category__item"
                  :class="{ active: selected == c.name }"
                  v-for="(c, i) in sub.filter(c => c.category == categoryKey)"
                  :key="i"
                  @click="selectCat(c.name)"
                  >{{ c.name }}</span
                >
              </div>
              <hr />
            </div>
          </div>
        </div>
      </transition>
      <div v-show="showCards">
        <TabMenu
          align-left
          :list="[
            {
              key: 1,
              title: '最热',
              onClick: () => (orderType = 'hot'),
              isActive: orderType == 'hot'
            },
            {
              key: 2,
              title: '最新',
              onClick: () => (orderType = 'new'),
              isActive: orderType == 'new'
            }
          ]"
        />
        <div class="loading-spinner" v-if="isLoading">
          <Spinner />
        </div>
        <SongCards v-else :cardLists="playlists" cardType="playlist" class="song-cards" />
        <Pagination :total="pageTotal" @change="handlePageChange" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getPlayListCatlist, getPlayList } from "@/service";
import SongCards from "@/components/globals/SongCards.vue";
import ChevronTopIcon from "@/components/SVGIcons/ChevronTopIcon.vue";
import ChevronBottomIcon from "@/components/SVGIcons/ChevronBottomIcon.vue";
import Pagination from "@/components/globals/Pagination.vue";
import TabMenu from "@/components/globals/TabMenu.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Playlist, PlaylistCreator } from "@/types";
import Spinner from "@/components/globals/Spinner.vue";

interface SubCategory {
  category: number;
  name: string;
}

@Component({
  components: {
    SongCards,
    ChevronTopIcon,
    ChevronBottomIcon,
    Pagination,
    TabMenu,
    Spinner
  }
})
export default class PlaylistComponent extends Vue {
  categories: object = {};

  sub: SubCategory[] = [];

  selected: string = "全部";

  showMenu: boolean = false;

  orderType: "hot" | "new" = "hot";

  playlists: Playlist[] = [];

  total: number = 0;

  offset: number = 0;

  showCards: boolean = true;

  limit = 20;

  isLoading: boolean = false;

  created() {
    getPlayListCatlist().then(
      res => {
        this.categories = res.data.categories;
        this.sub = res.data.sub;
      },
      error => {}
    );
    this.updatePlayList();
  }

  afterEnter() {
    console.log("afterEnter");
    if (this.showMenu == true) {
      this.showCards = false;
    }
  }

  beforeLeave() {
    console.log("beforeLeave");
    if (this.showCards == false) {
      this.showCards = true;
    }
  }

  updatePlayList() {
    this.isLoading = true;
    getPlayList(this.selected, this.orderType, this.offset).then(res => {
      if (res.data.code == 200) {
        this.total = res.data.total;
        this.playlists = res.data.playlists.map(
          (list: {
            id: number;
            coverImgUrl: string;
            name: string;
            updateTime: number;
            playCount: number;
            creator: PlaylistCreator;
          }) => ({
            id: list.id,
            picUrl: list.coverImgUrl,
            name: list.name,
            publishTime: list.updateTime,
            playCount: list.playCount,
            creator: list.creator
          })
        );
        this.isLoading = false;
      } else {
        alert(`获取歌单失败： ${res.data}`);
        this.isLoading = false;
      }
    });
  }

  selectCat(newCat: string) {
    this.selected = newCat;
    this.showMenu = false;
  }

  handlePageChange(currentPageidx: number) {
    this.offset = this.limit * currentPageidx;
    this.updatePlayList();
  }

  get pageTotal() {
    return Math.ceil(this.total / this.limit);
  }

  @Watch("selected")
  onSelectedChange() {
    this.offset = 0;
    this.updatePlayList();
  }

  @Watch("orderType")
  onOrderTypeChange() {
    this.offset = 0;
    this.updatePlayList();
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.category__selected
  position: relative
  z-index: 2
  font-size: 20px
  padding: 2em 0 1em
  margin-top: -1em
  background-color: white
.category__title
  margin-right: 0.5em
.category__toggle__btn
  cursor: pointer
.category__title, .category__title__icon
  vertical-align: middle
.category__title__icon
  width: 0.5em
  height: 0.5em
.category__list-wrapper
  position: relative
.category__list-container
  background-color: white
  z-index: 1
.category__sub
  display: none
.category__list
  display: flex
  flex-wrap: wrap
.category__item
  font-size: 14px
  margin: 1em 2em 1em 0
  padding: 0.5em 1em
  border-radius: 1.5em
  background-color: $whitegray2
  cursor: pointer
  &.active
    color: white
    background-color: $orange
@keyframes move-down
  0%
    top: -1200px
  100%
    top: 0px
@keyframes move-up
  0%
    top: 0px
  100%
    top: -1200px
.move-enter-active
  animation: move-down 0.5s ease forwards
.move-leave-active
  animation: move-up 0.5s ease forwards


.song-cards
  margin-top: 2em
.loading-spinner
  width: 2em
  height: 2em
  margin: 2em auto
</style>
