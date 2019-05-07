<template>
  <div>
    <div v-if="playlist">
      <div class="title">歌单（{{ count }}）</div>
      <ul class="list-container">
        <li v-for="list in playlist" :key="list.id">
          <router-link :to="'/playlist/' + list.id" class="list-item">
            <div class="playlist-cover">
              <ImageWithPlaceholder
                :src="list.coverImgUrl | convert2Https | clipImage(300, 300)"
                :alt="list.name"
                ratio="1:1"
              />
            </div>
            <HoverUnderline>
              <div class="name">{{ list.name }}</div>
            </HoverUnderline>
          </router-link>
        </li>
      </ul>
      <Pagination :total="pageTotal" @change="handlePageChange" />
    </div>
    <div class="loading-spinenr" v-else>
      <Spinner />
    </div>
    <ErrorLabel :show="isShowError">{{ errorMsg }}</ErrorLabel>
  </div>
</template>

<script>
import { getUserPlaylist } from "@/service";
import SongCards from "@/components/globals/SongCards";
import Pagination from "@/components/globals/Pagination";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder";
import Spinner from "@/components/globals/Spinner.vue";
import ErrorLabel from "@/components/globals/ErrorLabel";
import HoverUnderline from "@/components/globals/HoverUnderline.vue";

export default {
  data() {
    return {
      playlist: null,
      limit: 30,
      offset: 0,
      isLoading: true,
      isShowError: false,
      errorMsg: "获取用户歌单错误"
    };
  },
  props: {
    userId: Number,
    count: Number
  },
  components: {
    Pagination,
    ImageWithPlaceholder,
    Spinner,
    ErrorLabel,
    HoverUnderline
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
      getUserPlaylist(this.userId, this.offset).then(
        res => {
          this.playlist = res.data.playlist;
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
  gap: 2em
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
