<template>
  <div class="nav__bar">
    <!-- Log in and Sign in -->
    <div v-if="isLoggedin">
      <router-link
        class="current-user"
        :to="`/user/${currentUserProfile && currentUserProfile.userId}`"
      >
        <Avatar
          class="current-user__avatar"
          user
          :id="currentUserProfile.userId"
          :name="currentUserProfile.nickname"
          :imgSrc="currentUserProfile.avatarUrl"
        />
        <span class="current-user__nickname">{{
          currentUserProfile && currentUserProfile.nickname
        }}</span>
      </router-link>
    </div>
    <p class="login-signup__wrapper" v-else>
      <Button as="a" href="/login" primary class="login-signup__login"
        >登录</Button
      >
      <Button as="a" href="/signup" secondary>注册</Button>
    </p>
    <!-- 音乐库 -->
    <section class="nav__card">
      <p class="nav__card__title">音乐库</p>
      <NavItem to="/" exact>
        <template #icon>
          <AudioTrackIcon />
        </template>
        <template>
          发现音乐
        </template>
      </NavItem>
      <NavItem to="/playlist" exact>
        <template #icon>
          <LibraryMusicIcon />
        </template>
        <template>
          歌单
        </template>
      </NavItem>
      <NavItem to="/toplist" exact>
        <template #icon>
          <WhatsHotIcon />
        </template>
        <template>
          排行榜
        </template>
      </NavItem>
      <NavItem to="/mv" exact>
        <template #icon>
          <MvIcon />
        </template>
        <template>
          MV
        </template>
      </NavItem>
      <NavItem to="/search" exact>
        <template #icon>
          <SearchIcon />
        </template>
        <template>
          搜索
        </template>
      </NavItem>
    </section>
    <!-- 需要登录 -->
    <section v-if="isLoggedin">
      <!-- 我的音乐 -->
      <section class="nav__card">
        <p class="nav__card__title">我的音乐</p>
        <NavItem
          :to="`/record/${currentUserProfile && currentUserProfile.userId}`"
          exact
        >
          <template #icon>
            <MusicIcon />
          </template>
          <template>
            最近播放
          </template>
        </NavItem>
        <NavItem to="/sublist" exact>
          <template #icon>
            <MusicIcon />
          </template>
          <template>
            我的收藏
          </template>
        </NavItem>
        <NavItem to="/sublist" exact>
          <template #icon>
            <MusicIcon />
          </template>
          <template>
            我的收藏
          </template>
        </NavItem>
      </section>
      <!-- 我的歌单 -->
      <section class="nav__card">
        <!-- 标题栏 -->
        <p class="nav__card__title">
          <span class="title__item_left">我的歌单</span>
          <SvgBtn
            class="title__item_right"
            :class="{ arrow_up: isShowMyList }"
            @click.native="toggleMyList"
          >
            <RightArrowIcon />
          </SvgBtn>
        </p>
        <!-- 内容list -->
        <div v-if="isShowMyList">
          <NavItem
            :to="{
              path: 'likedsongs',
              params: { id: currentUserProfile && currentUserProfile.userId }
            }"
            exact
          >
            <template #icon>
              <MusicIcon />
            </template>
            <template>
              喜欢的音乐
            </template>
          </NavItem>
        </div>
      </section>
      <!-- 收藏的歌单 -->
      <section class="nav__card">
        <!-- 标题栏 -->
        <p class="nav__card__title">
          <span class="title__item_left">收藏的歌单</span>
          <SvgBtn
            class="title__item_right"
            :class="{ arrow_up: isShowMyFavr }"
            @click.native="toggleMyFavr"
          >
            <RightArrowIcon />
          </SvgBtn>
        </p>
        <!-- 内容list -->
        <div v-if="isShowMyFavr">
          <NavItem to="#" exact>
            <template #icon>
              <MusicIcon />
            </template>
            <template>
              最近播放
            </template>
          </NavItem>
          <NavItem to="#" exact>
            <template #icon>
              <MusicIcon />
            </template>
            <template>
              我的收藏
            </template>
          </NavItem>
          <NavItem to="#" exact>
            <template #icon>
              <MusicIcon />
            </template>
            <template>
              已购音乐
            </template>
          </NavItem>
        </div>
      </section>
    </section>

    <!-- change theme -->
    <section>
      <NavItem as="div" :to="undefined" @click.native="handleChangeTheme">
        <template #icon>
          <InvertColorIcon />
        </template>
        <template>
          切换主题
        </template>
      </NavItem>
    </section>
  </div>
</template>
<script lang="ts">
import MusicIcon from "@/components/SVGIcons/MusicIcon.vue";
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon.vue";
import Button from "@/components/globals/Button.vue";
import auth from "@/auth";
import { mapMutations } from "vuex";
import { Vue, Component, Watch, Inject } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import { User, Theme } from "@/types";
import { getUserDetail } from "@/service";
import InvertColorIcon from "@/components/SVGIcons/InvertColor.vue";
import SearchIcon from "@/components/SVGIcons/SearchIcon.vue";
import MvIcon from "@/components/SVGIcons/MvIcon.vue";
import WhatsHotIcon from "@/components/SVGIcons/WhatsHot.vue";
import LibraryMusicIcon from "@/components/SVGIcons/LibraryMusic.vue";
import AudioTrackIcon from "@/components/SVGIcons/AudioTrack.vue";
import NavItem from "@/components/NavBar/NavItem.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import Avatar from "@/components/globals/Avatar.vue";

const currentUser = namespace("currentUser");
const notification = namespace("notification");
const theme = namespace("theme");
@Component({
  components: {
    MusicIcon,
    RightArrowIcon,
    Button,
    InvertColorIcon,
    SearchIcon,
    MvIcon,
    WhatsHotIcon,
    LibraryMusicIcon,
    AudioTrackIcon,
    NavItem,
    SvgBtn,
    Avatar
  }
})
export default class Navbar extends Vue {
  isShowMyList: boolean = true;

  isShowMyFavr: boolean = true;

  isLoggedin: boolean = false;

  currentUserProfile: User | null = null;

  @currentUser.State("userId") currentUserId!: number | undefined;
  @currentUser.Mutation setCurrentUserId!: (id: number) => void;
  @notification.Mutation setMsg!: (msg: string) => void;

  @theme.State("value") theme!: Theme;
  @theme.Mutation("toggle") toggleTheme!: () => void;

  toggleMyList() {
    this.isShowMyList = !this.isShowMyList;
  }

  toggleMyFavr() {
    this.isShowMyFavr = !this.isShowMyFavr;
  }

  @Watch("currentUserId")
  onCurrentUserIdChanged(val: number | undefined) {
    if (val === undefined) {
      this.isLoggedin = false;
      return;
    }
    getUserDetail(val).then(
      res => {
        this.currentUserProfile = {
          userId: res.data.profile.userId,
          avatarUrl: res.data.profile.avatarUrl,
          nickname: res.data.profile.nickname
        };
        this.isLoggedin = true;
      },
      error => {
        const msg =
          "获取当前用户信息错误" +
          (error && error.msg ? error.msg + "！" : "！");
        this.setMsg(msg);
        this.isLoggedin = false;
      }
    );
  }

  handleChangeTheme() {
    this.toggleTheme();
  }
}
</script>
<style lang="sass">
@import "@/components/config.sass"
@import "@/style/theme.sass"

.nav__bar
  padding: 20px 10px
.nav__card
  margin-bottom: 20px
.nav__card__title
  font-size: 12px
  color: $gray



.title__item_right
  float: right
  transition: all 0.25s
  &.arrow_up
    transform: rotate(90deg)

.login-signup__wrapper
  display: flex
  flex-direction: row
  justify-content: center
.login-signup__login
  margin-right: 0.5em

.current-user
  font-size: 16px
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  border-radius: 9999px
  cursor: pointer
  transition: all 250ms
  padding: 0.2em 0.8em 0.2em 0.2em
  width: fit-content
  &:hover
    background: rgba(0, 0, 0, 0.2)
.current-user__avatar
  margin-right: 0.6em
.current-user__nickname
  font-weight: bolder
  flex: 0 0 auto
</style>
