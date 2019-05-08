<template>
  <!--
    +-----------------+----------------------+------------------+
    |                 |   name               |                  |
    |                 |                      |                  |
    | rounded avatar  |  signature           | message button   |
    |                 |                      |                  |
    |                 | 歌单：x  |  粉丝：x    |                  |
    +-----------------+----------------------+------------------+
  -->
  <div class="user-media-card__container" v-if="user">
    <router-link class="user-media-card__avatar" :to="`/user/${user.userId}`">
      <Avatar :name="user.nickname" :imgSrc="user.avatarUrl | clipImage(70, 70)" />
    </router-link>
    <!-- user info -->
    <div class="user-media-card__user-info">
      <!-- username -->
      <router-link class="user-info__nickname" :to="`/user/${user.userId}`">
        {{ user.nickname }}
      </router-link>
      <!-- signature -->
      <div class="user-info__signature" v-if="user.signature.length > 0">{{ user.signature }}</div>
      <!-- playlist count and followeds -->
      <div class="user-info__playlist-followeds" v-if="user.playlistCount && user.followeds">
        <span class="user-info__playlist">歌单：{{ user.playlistCount }}</span>
        <span>&nbsp;|&nbsp;</span>
        <span class="user-info__followeds">粉丝：{{ user.followeds }}</span>
      </div>
    </div>
    <!-- message button -->
    <Button class="user-media-card__message-button">私信</Button>
  </div>
</template>

<script>
import Avatar from "@/components/globals/Avatar";
import Button from "@/components/globals/Button";

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: { Avatar, Button }
};
</script>

<style lang="sass" scoped>
.user-media-card__container
  width: 100%
  box-sizing: border-box
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: flex-start
  border: 1px solid #eee
  padding: 1em
  border-radius: 0.25em
  background: rgba(250, 250, 250, 1)
.user-media-card__avatar
.user-media-card__user-info
  margin-left: 1em
  flex: 1 1 auto
  min-width: 0
  .user-info__nickname
    display: block
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .user-info__signature
    width: 100%
    color: #777
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    font-size: 12px
    margin-top: 0.3em
  .user-info__playlist-followeds
    color: #777
    font-size: 12px
    margin-top: 0.3em
    .user-info__playlist
    .user-info__followeds

.user-media-card__message-button
  flex: 0 0 auto;
  margin-left: 1em
</style>
