<template>
  <div class="user-detail">
    <div v-if="profile" class="user-detail__content">
      <!--
    +---------------+----------------------------------+---------+---------+
    |               |  nickname                        | message | follow  |
    |               +------------+---------+-----------+---------+---------+
    |   avatar      | eventCount | follows | followeds                     |
    |               +------------+---------+-------------------------------+
    |               |signature                                             |
    |               +------------------------------------------------------+
    |               | province city | age                                  |
    +---------------+------------------------------------------------------+
      -->
      <div class="user-detail__content__panel">
        <div class="avatar">
          <ImageWithPlaceholder
            :src="profile.avatarUrl | convert2Https | clipImage(300, 300)"
            :alt="profile.nickname"
            ratio="1:1"
          />
        </div>
        <div class="profile-detail">
          <div class="detail-row nickname-action">
            <div class="nickname">{{ profile.nickname }}</div>
            <div class="actions">
              <Button class="action-button" primary rounded v-if="!isSelf"
                >关注</Button
              >
              <Button class="action-button" primary rounded v-if="!isSelf"
                >发私信</Button
              >
              <Button
                class="action-button"
                rounded
                v-if="isSelf"
                @click.native="handleLogout"
                >退出</Button
              >
              <Button
                as="a"
                class="action-button"
                rounded
                v-if="isSelf"
                :href="`/useredit/${userId}`"
                >编辑</Button
              >
            </div>
          </div>
          <div class="detail-row interactive">
            <div class="event-count">
              <div class="count-num">{{ profile.eventCount }}</div>
              <div class="count-title">动态</div>
            </div>
            <router-link class="follows" :to="`/follows/${profile.userId}`">
              <div class="count-num">{{ profile.follows }}</div>
              <div class="count-title">关注</div>
            </router-link>
            <router-link class="followeds" :to="`/followeds/${profile.userId}`">
              <div class="count-num">{{ profile.followeds }}</div>
              <div class="count-title">粉丝</div>
            </router-link>
          </div>
          <div class="signature">
            <span class="bold-txt">个人介绍：</span>
            <span class="light-txt">{{ profile.signature }}</span>
          </div>
          <div class="detail-row district-age">
            <div class="district">
              <span class="bold-txt">所在地区：</span>
              <span class="light-txt">
                {{ province ? province.name : "其他" }}&nbsp;
                {{ city ? city.name : "其他" }}
              </span>
            </div>
            <div class="age" v-if="profile.birthday">
              <span class="bold-txt">年龄：</span>
              <span class="light-txt">{{ parsedAge }}</span>
            </div>
          </div>
          <div class="social-network light-txt">社交网络未绑定</div>
        </div>
      </div>
      <UserPlaylist
        class="user-detail__content__tracks"
        :userId="userId"
        :count="profile.playlistCount"
      />
    </div>
    <ErrorLabel class="get-user-detail-faild" :show="isGetUserDetailFailed"
      >获取用户信息错误。</ErrorLabel
    >
  </div>
</template>
<script lang="ts">
import provinceCitys from "./provinceCitys.json";
import { getUserDetail, logout } from "@/service";
import UserPlaylist from "@/components/user/UserPlaylist.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import { mapState, mapMutations } from "vuex";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import Button from "@/components/globals/Button.vue";
import { Mutation, namespace } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";

interface Profile {
  birthday: number;
  avatarUrl: string;
  nickname: string;
  eventCount: number;
  userId: number;
  follows: number;
  followeds: number;
  signature: string;
  playlistCount: number;
  province: number;
  city: number;
}
interface Destrict {
  name: string;
  code: number;
  children?: Destrict[];
}
const currentUser = namespace("currentUser");
const notification = namespace("notification");

@Component({
  components: {
    UserPlaylist,
    ImageWithPlaceholder,
    ErrorLabel,
    Button
  }
})
export default class UserDetail extends Vue {
  userId: number = 0; // from router param
  profile: Profile | null = null;
  isGetUserDetailFailed: boolean = false;

  handleLogout() {
    logout().then(
      res => {
        // logout success
        this.setCurrentUserId(undefined);
        this.$router.push("/");
        this.profile = null;
      },
      error => {
        // logout faile
        this.setMsg(`推出登录错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
  @currentUser.Mutation setCurrentUserId!: (id: number | undefined) => void;
  @currentUser.State("userId") currentUserId!: number | undefined;
  @notification.Mutation setMsg!: (msg: string) => void;

  get parsedAge(): string {
    if (!this.profile || !this.profile.birthday) return "";
    if (this.profile.birthday >= Date.parse("Jan 1 2010")) return "10后";
    if (this.profile.birthday >= Date.parse("Jan 1 2000")) return "00后";
    if (this.profile.birthday >= Date.parse("Jan 1 1990")) return "90后";
    if (this.profile.birthday >= Date.parse("Jan 1 1980")) return "80后";
    if (this.profile.birthday >= Date.parse("Jan 1 1970")) return "70后";
    if (this.profile.birthday >= Date.parse("Jan 1 1960")) return "60后";
    return "其他";
  }
  get isSelf(): boolean {
    return this.currentUserId == this.userId;
  }
  get province(): Destrict | undefined {
    return provinceCitys.find(
      (p: Destrict): boolean =>
        this.profile !== null && p.code == this.profile.province
    );
  }
  get city(): Destrict | undefined {
    if (this.province && this.province.children) {
      return this.province.children.find(
        (c: Destrict): boolean =>
          this.profile !== null && c.code == this.profile.city
      );
    }
    return undefined;
  }

  created() {
    this.userId = Number(this.$route.params.id);
    getUserDetail(this.userId).then(
      res => {
        this.profile = res.data.profile;
        this.isGetUserDetailFailed = false;
        if (this.isSelf) {
          this.setCurrentUserId(res.data.profile.userId);
        }
      },
      error => {
        this.isGetUserDetailFailed = true;
      }
    );
  }
}
</script>
<style lang="sass" scoped>
.user-detail
  padding: 1em
  &__content
    &__panel
      display: flex
      flex-direction: row
      justify-content: flex-start
    &__tracks
      margin-top: 1.25em
// common style
.bold-txt
  font-weight: bold
  font-size: 14px
.light-txt
  font-size: 14px
  opacity: 0.6

.avatar
  flex: 0 0 auto
  margin-right: 1em
  max-width: 12.5em
  width: 30vw

// user infomation row
.detail-row
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  flex-wrap: wrap
// first row includes nickname, message button and follow button
.nickname-action
  justify-content: space-between

.nickname
  font-size: 24px
  margin-right: 10px

.action-button
  margin-right: 1em
  margin-top: 0.5em

// second row includes eventCount, follows and followeds
.interactive
  margin-top: 1em
  border-top: 1px solid rgba(0, 0, 0, 0.1)
  padding-top: 0.5em
.count-num
  font-size: 24px
.count-title
  font-size: 13px
  opacity: 0.6
.event-count, .follows
  padding-right: 2em
  margin-right: 1em

// third row include userself signature
.signature
  margin-top: 1em

// fourth row include province city and age
.district-age
  margin-top: 0.6em
.district
  margin-right: 1em

// fifth row include user binded other social account
.social-network
  margin-top: 0.6em

.get-user-detail-faild
  margin: 6em auto
</style>
