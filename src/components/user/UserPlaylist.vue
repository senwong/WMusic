<template>
  <div>
    <div v-if="playlistMediaCardsData.length > 0">
      <div class="title">歌单（{{ count }}）</div>
      <MediaCardsGrid :data="playlistMediaCardsData" />
      <Pagination
        :total="pageTotal"
        :disabled="isLoading"
        @change="handlePageChange"
      />
    </div>
    <div class="loading-spinenr" v-else>
      <Spinner />
    </div>
    <ErrorLabel :show="isShowError">{{ errorMsg }}</ErrorLabel>
  </div>
</template>

<script>
import { getUserPlaylist } from "@/service";
import MediaCardsGrid from "@/components/globals/MediaCardsGrid";
import Pagination from "@/components/globals/Pagination";
import Spinner from "@/components/globals/Spinner.vue";
import ErrorLabel from "@/components/globals/ErrorLabel";
// import { MediaCardItem } from "@/types"

export default {
  data() {
    return {
      limit: 30,
      offset: 0,
      isLoading: false,
      isShowError: false,
      errorMsg: "获取用户歌单错误",
      playlistMediaCardsData: []
    };
  },
  props: {
    userId: Number,
    count: Number
  },
  components: {
    Pagination,
    Spinner,
    ErrorLabel,
    MediaCardsGrid
  },
  watch: {
    userId() {
      this.updatePlaylist();
    }
  },
  computed: {
    // number of pages to display, 1 ... n
    pageTotal() {
      return Math.ceil(this.count / this.limit);
    }
  },
  created() {
    this.updatePlaylist();
  },
  methods: {
    updatePlaylist() {
      if (!this.userId) return;
      this.isLoading = true;
      getUserPlaylist(this.userId, this.offset).then(
        res => {
          const playlist = res.data.playlist;
          this.playlistMediaCardsData = playlist.map(pl => ({
            type: "playlist",
            picUrl: pl.coverImgUrl,
            title: pl.name,
            id: pl.id,
            playCount: pl.playCount
          }));
          this.isLoading = false;
        },
        error => {
          if (error && error.msg) {
            this.errorMsg = error.msg;
          }
          this.isShowError = true;
          this.isLoading = false;
        }
      );
    },
    handlePageChange(currentPageIdx) {
      this.offset = this.limit * currentPageIdx;
      this.updatePlaylist();
    }
  }
};
</script>

<style lang="sass" scoped>
.title
  border-top: 1px solid rgba(0, 0, 0, 0.1)
  border-bottom: 1px solid rgba(0, 0, 0, 0.1)
  padding: 0.5em 2em
  font-size: 14px
  opacity: 0.6
.list-container
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
  grid-gap: 2em
  flex-wrap: wrap
  justify-content: flex-start
  padding: 2em
.list-item
  display: block
  .playlist-cover
    border: 1px solid rgba(0, 0, 0, 0.1)
    transition: all 250ms
    transform-origin: center
    transform-perspective: 100px
    &:hover
      transform: scale(1.03) translateY(-5px)
      box-shadow: 0 0 10px 2px #bbb
  .name
    margin-top: 1em
    font-size: 14px
    color: #666
    transition: all 250ms
    &:hover
      color: #000

.loading-spinenr
  height: 3em
  width: 3em
  margin: 3em auto
</style>
