<template>
  <div class="nav__bar">
    <!-- Log in and Sign in -->
    <div v-if="isLoggedin">
      <router-link class="current-user" :to="`/user/${currentUserProfile.userId}`">
        <img
          class="current-user__avatar"
          :src="currentUserProfile.avatarUrl"
          :alt="currentUserProfile.nickname"
        />
        <span class="current-user__nickname">{{ currentUserProfile.nickname }}</span>
      </router-link>
    </div>
    <p class="login-signup__wrapper" v-else>
      <Button as="a" href="/login" primary class="login-signup__login">登录</Button>
      <Button as="a" href="/signup">注册</Button>
    </p>
    <!-- 音乐库 -->
    <section class="nav__card">
      <p class="nav__card__title">音乐库</p>
      <router-link to="/" class="nav__link">
        <div class="icon icon_m">
          <MusicIcon />
        </div>
        <div class="nav__link_txt">发现音乐</div>
      </router-link>

      <router-link to="/playlist" class="nav__link">
        <div class="icon icon_m">
          <MusicIcon />
        </div>
        <div class="nav__link_txt">歌单</div>
      </router-link>

      <router-link to="/toplist" class="nav__link">
        <div class="icon icon_m">
          <MusicIcon />
        </div>
        <div class="nav__link_txt">排行榜</div>
      </router-link>

      <router-link to="/mv" class="nav__link">
        <div class="icon icon_m">
          <MusicIcon />
        </div>
        <div class="nav__link_txt">MV</div>
      </router-link>

      <router-link to="/search" class="nav__link">
        <div class="icon icon_m">
          <MusicIcon />
        </div>
        <div class="nav__link_txt">搜索</div>
      </router-link>
    </section>
    <!-- 需要登录 -->
    <section v-if="isLoggedin">
      <!-- 我的音乐 -->
      <section class="nav__card">
        <p class="nav__card__title">我的音乐</p>
        <router-link :to="`/record/${currentUserProfile.userId}`" class="nav__link">
          <div class="icon icon_m">
            <MusicIcon />
          </div>
          <div class="nav__link_txt">最近播放</div>
        </router-link>
        <router-link to="/sublist" class="nav__link">
          <div class="icon icon_m">
            <MusicIcon />
          </div>
          <div class="nav__link_txt">我的收藏</div>
        </router-link>
        <a href="#" class="nav__link">
          <div class="icon icon_m">
            <MusicIcon />
          </div>
          <div class="nav__link_txt">已购音乐</div>
        </a>
      </section>
      <!-- 我的歌单 -->
      <section class="nav__card">
        <!-- 标题栏 -->
        <p class="nav__card__title">
          <span class="title__item_left">我的歌单</span>
          <span
            class="title__item_right icon icon_s"
            :class="{ arrow_up: isShowMyList }"
            @click="toggleMyList"
          >
            <RightArrowIcon />
          </span>
        </p>
        <!-- 内容list -->
        <div v-if="isShowMyList">
          <router-link
            :to="{ path: 'likedsongs', params: { id: currentUserProfile.userId } }"
            class="nav__link"
          >
            <div class="icon icon_m">
              <MusicIcon />
            </div>
            <div class="nav__link_txt">喜欢的音乐</div>
          </router-link>
        </div>
      </section>
      <!-- 收藏的歌单 -->
      <section class="nav__card">
        <!-- 标题栏 -->
        <p class="nav__card__title">
          <span class="title__item_left">收藏的歌单</span>
          <span
            class="title__item_right icon icon_s"
            :class="{ arrow_up: isShowMyFavr }"
            @click="toggleMyFavr"
          >
            <RightArrowIcon />
          </span>
        </p>
        <!-- 内容list -->
        <div v-if="isShowMyFavr">
          <a href="#" class="nav__link">
            <div class="icon icon_m">
              <MusicIcon />
            </div>
            <div class="nav__link_txt">最近播放</div>
          </a>
          <a href="#" class="nav__link">
            <div class="icon icon_m">
              <MusicIcon />
            </div>
            <div class="nav__link_txt">我的收藏</div>
          </a>
          <a href="#" class="nav__link">
            <div class="icon icon_m">
              <MusicIcon />
            </div>
            <div class="nav__link_txt">已购音乐</div>
          </a>
        </div>
      </section>
    </section>
  </div>
</template>
<script lang="ts">
import MusicIcon from "@/components/SVGIcons/MusicIcon.vue";
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon.vue";
import Button from "@/components/globals/Button.vue";
import auth from "@/auth";
import { mapMutations } from "vuex";
import { Vue, Component } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import { User } from "@/types";

const currentUser = namespace("currentUser");

@Component({
  components: { MusicIcon, RightArrowIcon, Button }
})
export default class Navbar extends Vue {
  isShowMyList: boolean = true;

  isShowMyFavr: boolean = true;

  isLoggedin: boolean = false;

  currentUserProfile: User | null = null;

  @currentUser.Mutation setCurrentUserId!: (id: number) => void;

  toggleMyList() {
    this.isShowMyList = !this.isShowMyList;
  }

  toggleMyFavr() {
    this.isShowMyFavr = !this.isShowMyFavr;
  }

  updateLoginStatus() {
    auth.loggedIn().then(
      (res: any): void => {
        this.isLoggedin = true;
        this.currentUserProfile = res;
        this.setCurrentUserId(res.userId);
      },
      () => {
        this.isLoggedin = false;
      }
    );
  }

  created() {
    this.updateLoginStatus();
  }

  mounted() {
    const navLinks = Array.from(this.$el.querySelectorAll(".nav__link"));
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
  transition: all 250ms
  &:hover
    background: #ddd
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

.login-signup__wrapper
  display: flex;
  flex-direction: row;
  justify-content: center;
.login-signup__login
  margin-right: 0.5em;

.current-user
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 250ms;
  padding: 0.2em 0.8em 0.2em 0.2em;
  width: fit-content;
  &:hover
    background: rgba(0, 0, 0, 0.2);
.current-user__avatar
  width: 2em;
  height: 2em;
  border-radius: 9999px;
  margin-right: 0.6em;
.current-user__nickname
  font-weight: bolder;
  flex: 0 0 auto;
</style>
