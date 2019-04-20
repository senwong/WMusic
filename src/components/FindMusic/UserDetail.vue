<template>
<div v-if="profile">
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
  <div class="profile-panel">
    <div class="avatar">
      <img :src="profile.avatarUrl" :alt="profile.nickname" />
    </div>
    <div class="profile-detail">
      <div class="detail-row nickname-action">
        <div class="nickname">
          {{profile.nickname}}
        </div>
        <div class="actions">
          <button class="follow-button button-rounded button-primary">关注</button>
          <button class="message-button button-rounded">发私信</button>
        </div>
      </div>
      <div class="detail-row interactive">
        <div class="event-count">
          <div class="count-num">{{profile.eventCount}}</div>
          <div class="count-title">动态</div>
        </div>
        <div class="follows">
          <div class="count-num">{{profile.follows}}</div>
          <div class="count-title">关注</div>
        </div>
        <div class="followeds">
          <div class="count-num">{{profile.followeds}}</div>
          <div class="count-title">粉丝</div>
        </div>
      </div>
      <div class="signature">
         <span class="bold-txt">个人介绍：</span>
         <span class="light-txt">{{profile.signature}}</span>
      </div>
      <div class="detail-row district-age">
        <div class="district">
          <span class="bold-txt">所在地区：</span>
          <span class="light-txt">
            {{getDistrictName(profile.province)}}&nbsp;
            {{getDistrictName(profile.city)}}
          </span>
        </div>
        <div class="age" v-if="profile.birthday">
          <span class="bold-txt">年龄：</span>
          <span class="light-txt">{{parsedAge}}</span>
        </div>
      </div>
      <div class="social-network light-txt">
        社交网络未绑定
      </div>
    </div>
  </div>

  <UserPlaylist :userId="userId" :count="profile.playlistCount" />
</div>
</template>
<script>
import { getUserDetail } from '@/service';
import districtCodeNameMap from './districtCode.json';
import UserPlaylist from '@/components/FindMusic/UserPlaylist';

export default {
  name: "UserDetail",
  data() {
    return {
      userId: 0,
      profile: null,
    }
  },
  components: { UserPlaylist },
  methods: {
    getDistrictName(districtCode) {
      const name = districtCodeNameMap[districtCode];
      return name ? name : '其他';
    }
  },
  computed: {
    parsedAge() {
      if (!this.profile.birthday) return;
      if (this.profile.birthday >= Date.parse('Jan 1 2010')) return '10后';
      else if (this.profile.birthday >= Date.parse('Jan 1 2000')) return '00后';
      else if (this.profile.birthday >= Date.parse('Jan 1 1990')) return '90后';
      else if (this.profile.birthday >= Date.parse('Jan 1 1980')) return '80后';
      else if (this.profile.birthday >= Date.parse('Jan 1 1970')) return '70后';
      else if (this.profile.birthday >= Date.parse('Jan 1 1960')) return '60后';
      else return '其他';
    }
  },
  created() {
    this.userId = Number(this.$route.params.id);
    getUserDetail(this.userId).then(
      res => this.profile = res.data.profile,
      error => alert('get user detail error: ' + eror)
    );
  },
}
</script>
<style lang="sass" scoped>
// common style
.bold-txt
  font-weight: bold;
  font-size: 14px;
.light-txt
  font-size: 14px;
  opacity: 0.6;

.profile-panel
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 2em;
.avatar
  flex: 0 0 auto;
  width: 10em;
  height: 10em;
  margin-right: 2em;
  img
    width: 100%;
    height: 100%;
// user infomation row
.detail-row
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
// first row includes nickname, message button and follow button
.nickname-action
  justify-content: space-between;
.nickname
  font-size: 24px;
.follow-button
  margin-right: 1em;

// second row includes eventCount, follows and followeds
.interactive
  margin-top: 1em;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 0.5em;
.count-num
  font-size: 24px;
.count-title
  font-size: 13px;
  opacity: 0.6;
.event-count, .follows
  padding-right: 2em;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  margin-right: 1em;

// third row include userself signature 
.signature
  margin-top: 1em;

// fourth row include province city and age
.district-age
  margin-top: 0.6em;
.district
  margin-right: 1em;

// fifth row include user binded other social account
.social-network
  margin-top: 0.6em;
</style>
