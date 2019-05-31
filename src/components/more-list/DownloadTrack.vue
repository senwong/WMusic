<template>
  <more-item @click.native="handleDownload">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">下载</span>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track, Artist } from "@/types";
import { namespace, Mutation } from "vuex-class";
import { getSongURL } from "@/service";
import { downloadFile } from "@/utilitys";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";

const notification = namespace("playlist");
@Component({
  components: { DownloadIcon, MoreItem }
})
export default class Download extends Vue {
  @Prop() track!: Track;
  isLoading: boolean = false;
  @notification.Mutation setMsg!: (msg: string) => void;

  handleDownload() {
    this.isLoading = true;
    getSongURL(this.track.id).then(
      res => {
        const songUrl = res.data.data[0] && res.data.data[0].url;
        if (!songUrl) {
          this.isLoading = false;
          return;
        }
        const filename = `${this.track.name}-${this.track.artists
          .map((ar: Artist) => ar.name)
          .join(",")}.mp3`;
        downloadFile(songUrl, filename).then(
          () => {
            this.isLoading = false;
            this.setMsg("下载成功");
          },
          (error: any) => {
            this.isLoading = false;
            this.setMsg(`下载歌曲错误${error && error.msg ? error.msg : ""}！`);
          }
        );
      },
      error => {
        this.isLoading = false;
        this.setMsg(
          `获取下载歌曲地址错误${error && error.msg ? error.msg : ""}！`
        );
      }
    );
  }
}
</script>

<style></style>
