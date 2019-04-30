<template>
<div class="album-sublist">
  <ul class="album-sublist__container">
    <ListItem
      v-for="album in albums"
      :key="album.id"
      :to="`/album/${album.id}`"
      :imgSrc="album.picUrl | clipImage(150, 150)"
      :imgAlt="album.name"
    >
      <template v-slot:title>
        <router-link :to="`/album/${album.id}`">{{album.name}}</router-link>
      </template>
      <template v-slot:subtitle_1>
        <ArtistsWithComma :artists="album.artists" aTagClass='' commaClass='' />
      </template>
      <template v-slot:subtitle_2>
        {{album.size}}首
      </template>
    </ListItem>
  </ul>
  <ErrorLabel class="error-label" :show="isError">{{errorMsg}}</ErrorLabel>
  <PrevNextPagination :offset="offset" :limit="limit" :hasMore="hasMore" @offsetChange="handleOffsetChange"/>
</div>
</template>

<script>
import { getAlbumSublist } from '@/service';
import ErrorLabel from '@/components/globals/ErrorLabel';
import ListItem from './listitem';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma';
import PrevNextPagination from '@/components/globals/PrevNextPagination';

export default {
  data() {
    return {
      albums: [],
      isError: false,
      errorMsg: '获取收藏的专辑列表错误',
      offset: 0,
      limit: 25,
      hasMore: false,
    };
  },
  components: { ErrorLabel, ListItem, ArtistsWithComma, PrevNextPagination },
  created() {
    this.updateData();
  },
  methods: {
    updateData() {
      getAlbumSublist(this.offset, this.limit).then(
        res => {
          this.albums = res.data.data;
        },
        error => {
          if (error.msg) {
            this.errorMsg = error.msg;
          }
        }
      );
    },
    handleOffsetChange(newOffset) {
      this.offset = newOffset;
      this.updateData();
    }
  }
}
</script>

<style lang='sass' scoped>
.album-sublist
  padding-bottom: 2em
.error-label
  margin-top: 3em
</style>
