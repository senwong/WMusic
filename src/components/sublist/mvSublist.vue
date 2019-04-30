<template>
  <div class="mv-sublist">
    <div class="mv-sublist__container">
      <CardItem 
        v-for="mv in mvs"
        :key="mv.id"
        :card="{id: mv.vid, cover: mv.coverUrl, name: mv.title, artists: mv.creator.map(c => ({id: c.userId, name: c.userName}))}"
        cardType="mvplay"
      />
    </div>
    <ErrorLabel :show="isError" >{{errorMsg}}</ErrorLabel>
    <PrevNextPagination :offset="offset" :limit="limit" :hasMore="hasMore" @offsetChange="handleOffsetChange"/>
  </div>
</template>

<script>
import CardItem from '@/components/MV/CardItem';
import { getMvSublist } from '@/service';
import ErrorLabel from '@/components/globals/ErrorLabel';
import PrevNextPagination from '@/components/globals/PrevNextPagination';

export default {
  data() {
    return {
      mvs: [],
      errorMsg: '获取mv收藏列表错误',
      isError: false,
      hasMore: false,
      offset: 0,
      limit: 25,
    };
  },
  components: {
    CardItem,
    ErrorLabel,
    PrevNextPagination
  },
  created() {
    this.updateData();
  },
  methods: {
    updateData() {
      getMvSublist(this.offset, this.limit).then(
        res => {
          this.mvs = res.data.data;
          this.hasMore = res.data.hasMore;
        },
        error => {
          this.isError = true;
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
.mv-sublist
  padding-bottom: 2em 
.mv-sublist__container
  display: grid
  gap: 2em
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr))
  padding: 0 2em
</style>
