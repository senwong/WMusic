<template>
  <div v-if="playlist">
    <div class="title">歌单（{{count}}）</div>
    <ul class="list-container">
      <li v-for="list in playlist" :key="list.id">
        <a :href="'/playlist/' + list.id" class="list-item">
          <img :src="list.coverImgUrl | convert2Https | clipImage(300, 300)" :alt="list.name">
          <div class="name">{{list.name}}</div>
        </a>
      </li>
    </ul>
    <Pagination :total="pageTotal" @change="handlePageChange" />
  </div>
</template>

<script>
import { getUserPlaylist } from '@/service';
import SongCards from '@/components/globals/SongCards';
import Pagination from '@/components/globals/Pagination';

export default {
  data() {
    return {
      playlist: null,
      limit: 30,
      offset: 0,
    };
  },
  props: {
    userId: Number,
    count: Number,
  },
  components: { SongCards, Pagination, },
  watch: {
    userId() {
      this.updatePlaylist();
    }
  },
  computed: {
    // number of pages to display, 1 ... n
    pageTotal() {
      return Math.ceil(this.count / this.limit);
    },
  },
  created() {
    this.updatePlaylist();
  },
  methods: {
    updatePlaylist() {
      if (!this.userId) return;
      getUserPlaylist(this.userId, this.offset).then(
        res => {
          console.log('user playlist ', res.data);
          this.playlist = res.data.playlist;
        },
        error => alert('get user playlist error: ' + error)
      );
    },
    handlePageChange(currentPageIdx) {
      this.offset = this.limit * currentPageIdx;
      this.updatePlaylist();
    }
  },
}
</script>

<style lang="sass" scoped>
.title
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5em 2em;
  font-size: 14px;
  opacity: 0.6;
.list-container
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
  padding: 2em;
.list-item
  img
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  .name
    font-size: 14px;
</style>
