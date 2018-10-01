<template>
<div class="page-container">
  <navbar-component class="container__aside"></navbar-component>
  <main class="container__main">
    <router-view :key="$route.path"></router-view>
  </main>
  <playbar-component
    class="container__footer"
    @toggle-right-menu="toggleRightMenu"
  ></playbar-component>
  <!-- 右边弹出菜单 -->
  <play-list-component :songs="songs" class="right-menu"></play-list-component>

  <!-- 滚动页面返回顶部按钮 -->
  <transition name="fade">
    <svg v-if="isScrolled" class="back-top" @click="scrollToTop" viewBox="0 0 100 100" width="50" height="50" fill="none" stroke="currentColor" stroke-width="5">
      <circle cx="50" cy="50" r="45"></circle>
      <path d="M25 25 H75 M50 35 L25 60 M50 35 L75 60 M50 35 V 75 Z "></path>
    </svg>
  </transition>
</div>
</template>

<script>
import NavbarComponent from './components/Navbar.vue'
import PlaybarComponent from './components/playbar/Playbar.vue'
import PlayListComponent from './components/PlayList.vue';



export default {
  name: 'app',
  components: {
    NavbarComponent, PlaybarComponent, PlayListComponent
  },
  data() {
    return {
      songs: [],
      isScrolled: false,
    }
  },
  methods: {
    toggleRightMenu() {
      this.rightMenu && this.rightMenu.classList.toggle("right-menu_show")
    },

    scrollToTop() {
      if(!this.$el) return
      const el = this.$el.querySelector(".container__main")
      if(!el) return
      const duration = 0.6, distance = el.scrollTop, step = Math.floor(distance / (60 * duration));
      function s() {
        el.scrollTop -= step
        if(el.scrollTop > 0){
          window.requestAnimationFrame(s)
        }
      }
      window.requestAnimationFrame(s)
    }
  },
  mounted() {
    this.rightMenu = this.$el.querySelector(".right-menu");
    this.$el.querySelector(".container__main").addEventListener("scroll", e => {
      const isScrollBottom = e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight
      if (isScrollBottom !== this.$store.state.isScrollBottom) {
        this.$store.commit('changeScroll', isScrollBottom)
      }
      this.isScrolled = e.target.scrollTop > 0
    })
  },
}
</script>

<style lang="sass">
@import "@/style/reset.sass";
@import "@/style/global.sass";
</style>

<style lang="sass" scoped>
@import "components/config.sass";

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

.page-container 
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
// 侧边栏样式
.container__aside
  background-color: $whitegray2;
  flex: 0 0 250px;
  z-index: 1;
  height: calc(100% - #{$footerHeight});
  box-sizing: border-box;
  overflow-y: scroll;
  overscroll-behavior-y: auto;

.container__main
  flex: 1 1 auto;
  overflow: hidden;
  height: calc(100% - #{$footerHeight});
  box-sizing: border-box;
  z-index: 2;
.container__footer
  position: absolute;
  height: $footerHeight;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $whitegray2;
  z-index: 9;
  font-size: 16px;
// 右边弹出菜单
.right-menu
  position: absolute;
  top: 0;
  height: calc(100% - #{$footerHeight});
  overflow: hidden;
  width: 300px;
  right: -300px;
  transition: right 0.3s linear;
  z-index: 3;

.right-menu_show
  right: 0px;
  box-shadow: -8px 0px 11px -4px rgba(0,0,0,0.75);

.back-top
  position: fixed;
  bottom: calc(1em + #{$footerHeight});
  right: 1em;
  cursor: pointer;
  color: $whitegray3;
  transition: color 1s ease;
  z-index: 4;
  &:hover
    color: $gray;
// backtotop按钮动画
.fade-enter-active, .fade-leave-active
  transition: opacity .5s;
.fade-enter-active
  animation: fadeup .5s ease;
.fade-leave-active
  animation: fadedown .5s ease;
.fade-enter, .fade-leave-to
  opacity: 0;
@keyframes fadeup
  from
    opacity: 0;
    transform: translateY(50px);
  to
    opacity: 1;
    transform: translateY(0px);
@keyframes fadedown
  from
    opacity: 1;
    transform: translateY(00px);
  to
    opacity: 0;
    transform: translateY(50px);
@media screen and (max-width: 480px)
  .container__aside
    display: none;
  .container__footer
    font-size: 1.75vw;
</style>
