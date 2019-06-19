<template>
  <div class="app" :class="themeClass">
    <Navbar
      class="app__nav-bar scrollbar-invisible"
      :class="{
        'app__nav-bar--show': showNavBar,
        'app__nav-bar--middle': isMiddleWidth
      }"
    />
    <main class="app__main">
      <!-- router-view need in a 100% height div, to prevent scrolltoTopBtn scrolling -->
      <div
        class="app__main__pages"
        ref="scrollingEle"
        @scroll="handleAppMainScroll"
      >
        <router-view :key="$route.path" appear />
        <SvgBtn
          class="app__main__pages__nav-btn"
          :class="{ 'app__main__pages__nav-btn--right': showNavBar }"
          xlarge
          @click.native="handleShowNavbar"
        >
          <MenuIcon />
        </SvgBtn>
      </div>
      <transition name="slide-right">
        <Playlist v-show="isVisible" class="app__main__right-menu" />
      </transition>
      <!-- 滚动页面返回顶部按钮 -->
      <transition name="fade">
        <SvgBtn
          v-if="isScrolled"
          xlarge
          @click.native="scrollToTop"
          class="app__main__scroll-top-btn"
        >
          <ScrollToTopIcon />
        </SvgBtn>
      </transition>
    </main>
    <Playbar class="app__footer" />
    <!-- 通知 -->
    <GlobalNotification />
  </div>
</template>

<script lang="ts">
import Navbar from "@/components/NavBar/Navbar.vue";
import Playbar from "@/components/playbar/Playbar.vue";
import Playlist from "@/components/Playlist.vue";
import ScrollToTopIcon from "@/components/SVGIcons/ScrollToTopIcon.vue";
import GlobalNotification from "@/components/globals/GlobalNotification.vue";
import { Vue, Component } from "vue-property-decorator";
import { namespace, State, Mutation } from "vuex-class";
import { Theme } from "@/types";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import { getLoginStatus } from "@/service/index";
import { debounceTime } from "@/utilitys";
import MenuIcon from "@/components/SVGIcons/MenuIcon.vue";

const playlist = namespace("playlist");
const theme = namespace("theme");
const mainScroll = namespace("mainScroll");
const currentUser = namespace("currentUser");

@Component({
  components: {
    Navbar,
    Playbar,
    Playlist,
    ScrollToTopIcon,
    GlobalNotification,
    SvgBtn,
    MenuIcon
  }
})
export default class App extends Vue {
  @playlist.State isVisible!: boolean;

  @theme.State("value") theme!: Theme;
  @mainScroll.State("isBottom") mainIsScrollBottom!: boolean;
  @mainScroll.Mutation setIsBottom!: (b: boolean) => void;
  @mainScroll.Mutation setScrollTop!: (st: number) => void;
  @currentUser.Mutation setCurrentUserId!: (id: number) => void;

  $refs!: {
    scrollingEle: HTMLElement;
  };
  get themeClass(): string {
    switch (this.theme) {
      case Theme.Light:
        return "theme-light";
      case Theme.Dark:
        return "theme-dark";
      default:
        return "";
    }
  }
  debouncedSetScrollTop = debounceTime(this.setScrollTop.bind(this), 150);

  isScrolled: boolean = false;
  handleAppMainScroll(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) {
      return;
    }
    const { scrollTop, clientHeight, scrollHeight } = target;

    this.debouncedSetScrollTop(scrollTop);

    this.isScrolled = scrollTop > 0;
    const isBottom = scrollTop + clientHeight === scrollHeight;
    if (isBottom !== this.mainIsScrollBottom) {
      this.setIsBottom(isBottom);
    }
  }
  scrollToTop() {
    const el = this.$refs.scrollingEle;
    if (!el) return;
    let speed = 10; // every 1/60s, move 10px
    const g = 2; // // every 1/60s, speed += g
    const distance = el.scrollTop;
    function step() {
      if (!el) return;
      el.scrollTop -= speed;
      if (el.scrollTop > 0) {
        window.requestAnimationFrame(step);
      }
      if (el.scrollTop >= distance / 2) {
        speed += g;
      } else {
        speed = Math.max(speed - g, 0.1);
      }
    }
    window.requestAnimationFrame(step);
  }
  updateLoginStatus() {
    getLoginStatus().then(
      res => {
        const { profile } = res.data;
        this.setCurrentUserId(profile.userId);
      },
      error => {}
    );
  }
  created() {
    this.updateLoginStatus();
  }

  isMiddleWidth: boolean = window.matchMedia("(max-width: 1000px)").matches;
  showNavBar: boolean = !this.isMiddleWidth;
  handleShowNavbar() {
    this.showNavBar = !this.showNavBar;
  }
}
</script>

<style lang="sass">
@import "@/style/global.sass"
@import "@/style/reset.sass"
</style>

<style lang="sass" scoped>
@import "@/style/theme.sass"
@import "@/style/media-query.sass"
$navbar-width: 250px
$playbar-height: 6em

.app
  height: 100%
  position: relative
  overflow: hidden
  display: grid
  grid-template-areas: "nav-bar main" "footer footer"
  grid-template-columns: $navbar-width 1fr
  grid-template-rows: 1fr $playbar-height
  @include themify($themes)
    color: themed('text-color')
    background-color: themed('background-color')
  &__main
    grid-area: main
    position: relative
    overflow: hidden
    transform: translateZ(0)
    &__pages
      height: 100%
      overflow-y: scroll
      overflow-x: hidden
      position: relative
      &__nav-btn
        display: none
        position: fixed
        top: 0.5em
        left: 0.5em
        &--right
          left: calc(#{$navbar-width} + 0.5em)
    &__scroll-top-btn
      position: fixed
      bottom: 1em
      right: 1em
      background-color: inherit
      border-radius: 9999px
    &__right-menu
      position: absolute
      right: 0
      top: 0
      height: 100%
      width: 300px
      overflow-y: scroll
      z-index: 3
      box-shadow: 0 0 42px 3px rgba(0, 0, 0, .2)
  &__nav-bar
    grid-area: nav-bar
    z-index: 1
    box-sizing: border-box
    overflow-y: scroll
    overscroll-behavior: contain
    box-sizing: border-box
    &--middle
      position: absolute
      top: 0
      left: -250px
      width: $navbar-width
      height: calc(100% - #{$playbar-height})
    &--show
      left: 0px
  &__footer
    grid-area: footer
@media (max-width: $middle-width)
  .app
    grid-template-areas: "main main" "footer footer"
    grid-template-columns: 250px 1fr
    grid-template-rows: 1fr 6em
    &__main__pages__nav-btn
      display: block

.app
  @include themify($themes)
    &__main, &__footer
      color: themed('text-color')
      background-color: themed('background-color')
    &__nav-bar
      color: themed('secondary-text-color')
      background-color: themed('secondary-background-color')

// right menu transition
.slide-right
  &-enter-active, &-leave-active
    transition: all .5s
  &-enter, &-leave-to
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0)
    transform: translateX(300px)
// backtotop按钮动画
.fade-enter-active, .fade-leave-active
  transition: opacity .5s
.fade-enter-active
  animation: fadeup .5s ease
.fade-leave-active
  animation: fadedown .5s ease
.fade-enter, .fade-leave-to
  opacity: 0
@keyframes fadeup
  from
    opacity: 0
    transform: translateY(50px)
  to
    opacity: 1
    transform: translateY(0px)
@keyframes fadedown
  from
    opacity: 1
    transform: translateY(00px)
  to
    opacity: 0
    transform: translateY(50px)
</style>
