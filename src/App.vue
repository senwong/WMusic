<template>
  <div class="page-container">
    <navbar-component class="container__aside scrollbar-invisible" />
    <main class="container__main">
      <router-view :key="$route.path" />
    </main>
    <playbar-component class="container__footer" />
    <!-- 右边弹出菜单 -->
    <transition name="slide-fade">
      <play-list-component v-show="isVisible" class="right-menu" />
    </transition>

    <!-- 滚动页面返回顶部按钮 -->
    <transition name="fade">
      <button v-if="isScrolled" @click="scrollToTop" class="button_icon large back-top">
        <ScrollToTopIcon />
      </button>
    </transition>
    <!-- 通知 -->
    <GlobalNotification />
  </div>
</template>

<script lang="ts">
import NavbarComponent from "@/components/Navbar.vue";
import PlaybarComponent from "@/components/playbar/Playbar.vue";
import PlayListComponent from "@/components/Playlist.vue";
import ScrollToTopIcon from "@/components/SVGIcons/ScrollToTopIcon.vue";
import GlobalNotification from "@/components/globals/GlobalNotification.vue";
import { Vue, Component } from "vue-property-decorator";
import { namespace, State } from "vuex-class";

const playlist = namespace("playlist");
@Component({
  components: {
    NavbarComponent,
    PlaybarComponent,
    PlayListComponent,
    ScrollToTopIcon,
    GlobalNotification
  }
})
export default class App extends Vue {
  @playlist.State isVisible!: boolean;
  isScrolled: boolean = false;
  toggleRightMenu() {
    // this.rightMenu && this.rightMenu.classList.toggle("right-menu_show")
    // this.rightPlayListVisible = !this.rightPlayListVisible;
  }
  scrollToTop() {
    if (!this.$el) return;
    const el = document.scrollingElement;
    if (!el) return;
    const duration = 0.6;
    const distance = el.scrollTop;
    const step = Math.floor(distance / (60 * duration));
    function s() {
      if (!el) return;
      el.scrollTop -= step;
      if (el.scrollTop > 0) {
        window.requestAnimationFrame(s);
      }
    }
    window.requestAnimationFrame(s);
  }
}
</script>

<style lang="sass">
@import "@/style/reset.sass"
@import "@/style/global.sass"
@import "@/style/colors.sass"
</style>

<style lang="sass" scoped>
@import "components/config.sass"

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

.page-container
  margin: auto
  width: 100%
  height: 100%
  position: relative
  overflow: hidden
// 侧边栏样式
.container__aside
  background-color: $whitegray2
  position: fixed
  width: 250px
  height: calc(100% - #{$footerHeight})
  z-index: 1
  box-sizing: border-box
  overflow-y: scroll
  overscroll-behavior: contain
  box-sizing: border-box

.container__main
  overflow: scroll
  height: calc(100% - #{$footerHeight})
  box-sizing: border-box
  z-index: 2
  margin-left: 250px
.container__footer
  position: fixed
  height: $footerHeight
  bottom: 0
  left: 0
  right: 0
  background-color: $whitegray2
  z-index: 9
  font-size: 16px
// 右边弹出菜单
.right-menu
  position: fixed
  top: 0
  height: calc(100% - #{$footerHeight})
  overflow: hidden
  width: 300px
  right: 0
  transition: right 0.2s linear
  z-index: 3
.slide-fade-enter-active
  transition: all .25s ease

.slide-fade-leave-active
  transition: all .25s ease

.slide-fade-enter, .slide-fade-leave-to
  transform: translateX(300px)


.right-menu_show
  right: 0px
  box-shadow: -8px 0px 11px -4px rgba(0,0,0,0.75)

.back-top
  position: fixed
  bottom: calc(1em + #{$footerHeight})
  right: 1em
  cursor: pointer
  color: $whitegray3
  transition: color 1s ease
  z-index: 4
  &:hover
    color: $gray
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
@media screen and (max-width: 480px)
  .container__aside
    display: none
  .container__footer
    font-size: 1.75vw
</style>
