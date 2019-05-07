<template>
  <div class="mv-sublist">
    <div class="mv-sublist__container">
      <CardItem v-for="mv in mvs" :key="mv.id" :card="mv" cardType="mvplay" />
    </div>
    <ErrorLabel :show="isError">{{ errorMsg }}</ErrorLabel>
    <PrevNextPagination
      :offset="offset"
      :limit="limit"
      :hasMore="hasMore"
      @offsetChange="handleOffsetChange"
    />
  </div>
</template>

<script lang="ts">
import CardItem from "@/components/MV/CardItem.vue";
import { getMvSublist } from "@/service";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import PrevNextPagination from "@/components/globals/PrevNextPagination.vue";
import { Vue, Component } from "vue-property-decorator";
import { MvCard } from "@/types";

interface MvFromServer {
  vid: number;
  coverUrl: string;
  title: string;
  creator: { userId: number; userName: string }[];
}

@Component({
  components: {
    CardItem,
    ErrorLabel,
    PrevNextPagination
  }
})
export default class MvSubList extends Vue {
  mvs: MvCard[] = [];

  errorMsg: string = "获取mv收藏列表错误";

  isError: boolean = false;

  hasMore: boolean = false;

  offset: number = 0;

  readonly limit: number = 25;

  created() {
    this.updateData();
  }

  updateData() {
    getMvSublist(this.offset, this.limit).then(
      res => {
        this.mvs = res.data.data.map(
          (mv: MvFromServer): MvCard => ({
            id: mv.vid,
            cover: mv.coverUrl,
            name: mv.title,
            artists: mv.creator.map(c => ({
              id: c.userId,
              name: c.userName
            }))
          })
        );
        this.hasMore = res.data.hasMore;
      },
      error => {
        this.isError = true;
        if (error.msg) {
          this.errorMsg = error.msg;
        }
      }
    );
  }

  handleOffsetChange(newOffset: number) {
    this.offset = newOffset;
    this.updateData();
  }
}
</script>

<style lang="sass" scoped>
.mv-sublist
  padding-bottom: 2em
.mv-sublist__container
  display: grid
  gap: 2em
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
  padding: 0 2em
</style>
