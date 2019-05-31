<template>
  <more-item spread="left">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">添加到歌单</span>
    <!-- hover时右侧扩展内容 -->
    <more-list slot="spread-list">
      <more-item
        v-for="p in userPlaylists"
        :key="p.id"
        @click.native="handleClick"
      >
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">{{ p.name }}</span>
      </more-item>
    </more-list>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track, Playlist } from "@/types";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import MoreList from "@/components/more-list/MoreList.vue";
import { getUserPlaylist, addToPlaylist } from "@/service";
import { State, namespace } from "vuex-class";
import { isUndef } from "@/utilitys";

const currentUser = namespace("currentUser");
const notification = namespace("notification");
@Component({
  components: { MoreItem, DownloadIcon, MoreList }
})
export default class AddToUserPlaylist extends Vue {
  @Prop() track!: Track;
  userPlaylists: Playlist[] = [];
  @currentUser.State("userId") currentUserId!: number;
  @notification.Mutation setMsg!: (msg: string) => void;
  updateUserPlaylists() {
    if (isUndef(this.currentUserId)) {
      return;
    }
    getUserPlaylist(this.currentUserId).then(
      res => {
        this.userPlaylists = res.data.playlist;
      },
      error => {
        this.setMsg(`获取用户歌单错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
  handleClick(playlistId: number) {
    addToPlaylist(playlistId, this.track.id).then(
      res => {
        this.setMsg(`添加到歌单成功！`);
      },
      error => {
        this.setMsg(`添加到歌单错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
  created() {
    this.updateUserPlaylists();
  }
}
</script>

<style></style>
