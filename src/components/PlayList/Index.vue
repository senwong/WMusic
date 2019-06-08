<template>
  <div class="playlist">
    <div class="playlist__top category__selected">
      <Button noborder rounded secondary @click.native="showMenu = !showMenu">
        <span class="category__title">{{ selected }}</span>
        <span class="category__toggle__btn">
          <ChevronTopIcon
            class="category__title__icon"
            :class="{ 'category__title__icon--rotate': showMenu }"
          />
        </span>
      </Button>
    </div>
    <div class="playlist__bottom">
      <transition name="slide-in-out">
        <div v-if="!showMenu" class="playlist__bottom__wrapper" key="0">
          <TabMenu align-left :list="tabList" />
          <div class="song-cards__wrapper">
            <transition
              :name="orderType === 'hot' ? 'slide-left' : 'slide-right'"
              @after-enter="handleAfterEnter"
            >
              <div v-if="orderType === 'new'" key="0" class="song-cards">
                <MediaCardsGrid
                  :data="newPlaylistsMediaCardsData"
                  cardType="playlist"
                />
                <Pagination
                  :total="pageTotal"
                  :disabled="isLoading"
                  @change="handlePageChange"
                />
              </div>
              <div key="1" v-else class="song-cards">
                <MediaCardsGrid :data="hotPlaylistsMediaCardsData" />
                <Pagination
                  :total="pageTotal"
                  :disabled="isLoading"
                  @change="handlePageChange"
                />
              </div>
            </transition>
          </div>
        </div>
        <div
          v-else
          class="category__list-wrapper playlist__bottom__wrapper"
          key="1"
        >
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
            <div
              v-for="categoryKey in Object.keys(categories)"
              :key="categoryKey"
            >
              <h3>{{ categories[categoryKey] }}</h3>
              <div class="category__list">
                <span
                  class="category__item"
                  :class="{ active: selected == c.name }"
                  v-for="(c, i) in sub.filter(
                    c => String(c.category) == categoryKey
                  )"
                  :key="i"
                  @click="selectCat(c.name)"
                  >{{ c.name }}
                </span>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { getPlayListCatlist, getPlayList } from "@/service";
import MediaCardsGrid from "@/components/globals/MediaCardsGrid.vue";
import ChevronTopIcon from "@/components/SVGIcons/ChevronTopIcon.vue";
import ChevronBottomIcon from "@/components/SVGIcons/ChevronBottomIcon.vue";
import Pagination from "@/components/globals/Pagination.vue";
import TabMenu from "@/components/globals/TabMenu.vue";
import { Vue, Component, Prop, Watch, Provide } from "vue-property-decorator";
import { Playlist, PlaylistCreator, TabMenuItem, MediaCardItem } from "@/types";
import { Mutation, namespace } from "vuex-class";
import Button from "@/components/globals/Button.vue";

const notification = namespace("notification");

interface SubCategory {
  category: number;
  name: string;
}

@Component({
  components: {
    MediaCardsGrid,
    ChevronTopIcon,
    ChevronBottomIcon,
    Pagination,
    TabMenu,
    Button
  }
})
export default class PlaylistComponent extends Vue {
  categories: object = {};

  sub: SubCategory[] = [];

  selected: string = "全部";

  showMenu: boolean = false;

  orderType: "hot" | "new" = "hot";

  newPlaylistsMediaCardsData: MediaCardItem[] = [];
  hotPlaylistsMediaCardsData: MediaCardItem[] = [];

  total: number = 0;

  offset: number = 0;

  showCards: boolean = true;

  limit = 20;

  updateTimeoutId: number | null = null;

  isLoading: boolean = false;
  @Provide() animationEnded = { value: 0 };
  @notification.Mutation setMsg!: (msg: string) => void;

  get tabList(): TabMenuItem[] {
    return [
      {
        key: 1,
        title: "最热",
        onClick: () => (this.orderType = "hot"),
        isActive: this.orderType == "hot"
      },
      {
        key: 2,
        title: "最新",
        onClick: () => (this.orderType = "new"),
        isActive: this.orderType == "new"
      }
    ];
  }

  created() {
    getPlayListCatlist().then(
      res => {
        this.categories = res.data.categories;
        this.sub = res.data.sub;
      },
      error => {
        this.setMsg(`获取歌单分类错误${error && error.msg ? error.msg : ""}！`);
      }
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
        const playlists = res.data.playlists.map(
          (list: {
            id: number;
            coverImgUrl: string;
            name: string;
            updateTime: number;
            playCount: number;
            creator: PlaylistCreator;
          }) => ({
            type: "playlist",
            picUrl: list.coverImgUrl,
            id: list.id,
            title: list.name,
            subTitle: list.creator && list.creator.nickname,
            subLink: list.creator && `/user/${list.creator.userId}`,
            playCount: list.playCount
          })
        );
        if (this.orderType === "new") {
          this.newPlaylistsMediaCardsData = playlists;
        } else {
          this.hotPlaylistsMediaCardsData = playlists;
        }
      } else {
        alert(`获取歌单失败： ${res.data}`);
      }
      this.isLoading = false;
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
  handleAfterEnter() {
    this.animationEnded.value = performance.now();
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
    if (this.updateTimeoutId) {
      clearTimeout(this.updateTimeoutId);
    }
    this.updateTimeoutId = setTimeout(() => {
      this.updatePlayList();
    }, 1000);
  }
}
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

.playlist
  padding: 0 1em 1em
  &__top
    z-index: 1
    @include themify($themes)
      background-color: themed('background-color')
  &__bottom
    position: relative
    z-index: 0
    &__wrapper
      @include themify($themes)
        background-color: themed('background-color')
      position: absolute
      top: 0
      left: 0
      width: 100%
.category__selected
  position: relative
  font-size: 20px
  padding: 1em 0 1em
.category__title
  margin-right: 0.5em
.category__toggle__btn
  cursor: pointer
.category__title, .category__title__icon
  vertical-align: middle
.category__title__icon
  width: 0.5em
  height: 0.5em
  transition: all 0.25s
  transform: rotate(90deg)
  &--rotate
    transform: rotate(180deg)

.category__list-container
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
  cursor: pointer
  transition: all 250ms
  @include themify($themes)
    background-color: themed('background-color')
    &:hover
      background-color: themed('background-color-hover')
    &.active
      color: themed('primary-text-color')
      background-color: themed('primary-background-color')

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

.song-cards__wrapper
  position: relative
.song-cards
  margin-top: 2em
  position: absolute
  top: 0
  left: 0
  width: 100%
.loading-spinner
  width: 2em
  height: 2em
  margin: 2em auto


.slide-in-out
  &-enter-active, &-leave-active
    transition: all .7s
  &-enter
    transform: translateY(-300px)
    opacity: 0
    visibility: hidden
  &-enter-to
    transform: translateY(0px)
  &-leave
    transform: translateY(0px)
  &-leave-to
    transform: translateY(300px)
    opacity: 0
    visibility: visible
.slide-left
  &-enter-active, &-leave-active
    transition: all .7s
  &-enter
    transform: translateX(100%)
    opacity: 0
    visibility: hidden
  &-enter-to
    transform: translateX(0px)
  &-leave
    transform: translateX(0px)
  &-leave-to
    transform: translateX(-100%)
    opacity: 0
    visibility: visible
.slide-right
  &-enter-active, &-leave-active
    transition: all .7s
  &-enter
    transform: translateX(-100%)
    opacity: 0
    visibility: hidden
  &-enter-to
    transform: translateX(0px)
  &-leave
    transform: translateX(0px)
  &-leave-to
    transform: translateX(100%)
    opacity: 0
    visibility: visible
</style>
