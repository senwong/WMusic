<template>
  <div class="nav__bar">
    <!-- 音乐库 -->
    <section class="nav__card">
      <p class="nav__card__title">音乐库</p>
      <router-link to="/" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          发现音乐
        </div>
      </router-link>

      <router-link to="/playlidtIndex" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          歌单
        </div>
      </router-link>

      <router-link to="/toplist" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          排行榜
        </div>
      </router-link>

      <router-link to="/mv" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          MV
        </div>
      </router-link>

      <router-link to="/search" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          搜索
        </div>
      </router-link>

    </section>
    <!-- 我的音乐 -->
    <section class="nav__card">
      <p class="nav__card__title">我的音乐</p>
      <a href="#" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          最近播放
        </div>
      </a>
      <a href="#" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          我的收藏
        </div>
      </a>
      <a href="#" class="nav__link">
        <div class="icon icon_m">
          <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
            <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
            <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
          </svg>
        </div>
        <div class="nav__link_txt">
          已购音乐
        </div>
      </a>
    </section>
    <!-- 我的歌单 -->
    <section class="nav__card">
      <!-- 标题栏 -->
      <p class="nav__card__title">
        <span class="title__item_left">我的歌单</span>
        <span
          class="title__item_right icon icon_s"
          :class="{arrow_up: isShowMyList}"
          @click="toggleMyList"
          >
          <svg class="i-chevron-right" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M12 30 L24 16 12 2"></path>
          </svg>
        </span>
      </p>
      <!-- 内容list -->
      <div v-if="isShowMyList">
        <a href="#" class="nav__link">
          <div class="icon icon_m">
            <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
              <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
              <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
            </svg>
          </div>
          <div class="nav__link_txt">
            喜欢的音乐
          </div>
        </a>
      </div>
    </section>
    <!-- 收藏的歌单 -->
    <section class="nav__card">
      <!-- 标题栏 -->
      <p class="nav__card__title">
        <span class="title__item_left">收藏的歌单</span>
        <span
          class="title__item_right icon icon_s"
          :class="{arrow_up: isShowMyFavr}"
          @click="toggleMyFavr"
          >
          <svg class="i-chevron-right" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M12 30 L24 16 12 2"></path>
          </svg>
        </span>
      </p>
      <!-- 内容list -->
      <div v-if="isShowMyFavr">
        <a href="#" class="nav__link">
          <div class="icon icon_m">
            <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
              <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
              <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
            </svg>
          </div>
          <div class="nav__link_txt">
            最近播放
          </div>
        </a>
        <a href="#" class="nav__link">
          <div class="icon icon_m">
            <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
              <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
              <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
            </svg>
          </div>
          <div class="nav__link_txt">
            我的收藏
          </div>
        </a>
        <a href="#" class="nav__link">
          <div class="icon icon_m">
            <svg class="i-music" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M11 25 L11 6 24 3 24 23 M11 13 L24 10"></path>
              <ellipse cx="7" cy="25" rx="4" ry="5"></ellipse>
              <ellipse cx="20" cy="23" rx="4" ry="5"></ellipse>
            </svg>
          </div>
          <div class="nav__link_txt">
            已购音乐
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    name: "Navbar",
    data() {
      return {
        isShowMyList: true,
        isShowMyFavr: true,
      }
    },
    methods: {
      toggleMyList() {
        this.isShowMyList = !this.isShowMyList;
      },
      toggleMyFavr() {
        this.isShowMyFavr = !this.isShowMyFavr;
      },
    },
    mounted() {
      const navLinks = Array.from(this.$el.querySelectorAll(".nav__link"))
    }
  }
</script>
<style lang="sass">
@import "config.sass";

.nav__bar
  padding: 20px 10px;
.nav__card
  margin-bottom: 20px;
.nav__card__title
  font-size: 12px;
  color: $gray;
.nav__link
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  padding: 5px;
  border-radius: 2px;
  margin-bottom: 5px;
  &.router-link-exact-active
    background-color: $orange;
    color: white;

.nav__link.active
  background-color: $orange;
  color: white;
.nav__link__icon
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;

.nav__link_txt
  margin-left: 5px;
  font-size: 13px;
.icon
  display: inline-block;
  img
    width: 100%;
    height: 100%;
.icon_s
  width: 12px;
  height: 12px;
.icon_m
  width: 25px;
  height: 25px;
.title__item_right
  float: right;
.arrow_up
  transform: rotate(90deg);
</style>
