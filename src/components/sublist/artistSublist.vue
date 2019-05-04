<template>
<div class="artist-sublist">
  <ul class="album-sublist__container">
    <ListItem
      v-for="artist in artists"
      :key="artist.id"
      :to="`/artist/${artist.id}`"
      :imgSrc="artist.picUrl | clipImage(150, 150)"
      :imgAlt="artist.name"
    >
      <template v-slot:title>
        {{artist.name}}
        <span v-if="artist.alias.length>0">
          ({{artist.alias.join(',')}})
        </span>
      </template>
      <template v-slot:subtitle_1>
        专辑：{{artist.albumSize}}
      </template>
      <template v-slot:subtitle_2>
        MV: {{artist.mvSize}}
      </template>
    </ListItem>
  </ul>
  <ErrorLabel class="error-label" :show="isError">{{errorMsg}}</ErrorLabel>
  <PrevNextPagination :offset="offset" :limit="limit" :hasMore="hasMore" @offsetChange="handleOffsetChange"/>
</div>
</template>

<script lang='ts'>
import { getArtistSublist } from '@/service';
import ErrorLabel from '@/components/globals/ErrorLabel.vue';
import ListItem from './listitem.vue';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma.vue';
import PrevNextPagination from '@/components/globals/PrevNextPagination.vue';
import { Artist } from '@/types';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    ErrorLabel,
    ListItem,
    ArtistsWithComma,
    PrevNextPagination,
  },
})
export default class ArtistSubList extends Vue {

  artists: Artist[] = [];
  isError: boolean = false;
  errorMsg: string = '获取收藏的歌手列表错误';
  offset: number = 0;
  readonly limit: number = 25;
  hasMore: boolean = false;
  
  created() {
    this.updateData();
  }
  
  updateData(): void {
    getArtistSublist(this.offset, this.limit).then(
      res => {
        this.artists = res.data.data;
        this.hasMore = res.data.hasMore;
      },
      error => {
        if (error.msg) {
          this.errorMsg = error.msg;
        }
      }
    );
  }
  handleOffsetChange(newOffset: number): void {
    this.offset = newOffset;
    this.updateData();
  }
}
</script>

<style lang='sass' scoped>
.artist-sublist
  padding-bottom: 2em
.error-label
  margin-top: 3em
</style>
