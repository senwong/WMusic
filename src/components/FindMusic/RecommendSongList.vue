<template>
  <div>
    <h1>推荐歌单</h1>
    <MediaCardsGrid :data="mediaCardsData" />
    <ErrorLabel :show="showError">{{ errorMsg }}</ErrorLabel>
  </div>
</template>
<script lang="ts">
import { getRecommendSongList } from "@/service";
import MediaCardsGrid from "@/components/globals/MediaCardsGrid.vue";
import { Playlist, MediaCardItem } from "@/types";
import { Vue, Component } from "vue-property-decorator";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import LoadingSpinner from "@/components/globals/Spinner.vue";

interface RecommendPlayistType {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  trackCount: number;
  type: number;
}

@Component({
  components: { MediaCardsGrid, ErrorLabel, LoadingSpinner }
})
export default class RecommendSongList extends Vue {
  errorMsg: string = "获取推荐歌单错误";

  showError: boolean = false;

  isLoading: boolean = false;

  mediaCardsData: MediaCardItem[] = [];

  created() {
    this.isLoading = true;
    getRecommendSongList().then(
      res => {
        const songList = res.data.result;
        this.mediaCardsData = songList.map((sl: RecommendPlayistType) => ({
          type: "playlist",
          picUrl: sl.picUrl,
          title: sl.name,
          id: sl.id,
          playCount: sl.playCount
        }));
        this.isLoading = false;
      },
      error => {
        if (error && error.msg) {
          this.errorMsg = error.msg;
        }
        this.showError = true;
      }
    );
  }
}
</script>
