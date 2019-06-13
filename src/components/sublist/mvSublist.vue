<template>
  <div class="mv-sublist">
    <MediaCardsGrid :data="mvs" />
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
import CardItem from "@/components/globals/CardItem.vue";
import { getMvSublist } from "@/service";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import PrevNextPagination from "@/components/globals/PrevNextPagination.vue";
import { Vue, Component } from "vue-property-decorator";
import { MvCard, MvType, MediaCardItem, MediaCardType } from "@/types";
import Placeholder from "@/components/globals/Placeholder.vue";
import MediaCardsGrid from "@/components/globals/MediaCardsGrid.vue";

interface MvFromServer {
  vid: number;
  coverUrl: string;
  title: string;
  creator: { userId: number; userName: string }[];
  playTime: number;
}

@Component({
  components: {
    CardItem,
    ErrorLabel,
    PrevNextPagination,
    Placeholder,
    MediaCardsGrid
  }
})
export default class MvSubList extends Vue {
  mvs: MediaCardItem[] = [];

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
          (mv: MvFromServer): MediaCardItem => ({
            type: MediaCardType.Mv,
            picUrl: mv.coverUrl,
            title: mv.title,
            id: mv.vid,
            subTitle: mv.creator && mv.creator[0] && mv.creator[0].userName,
            subLink:
              mv.creator && mv.creator[0] && mv.creator[0].userId !== undefined
                ? `/artist/${mv.creator[0].userId}`
                : undefined,
            playCount: mv.playTime
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
.placeholder__cover
  padding-bottom: 56.25%
  border-radius: 15px
.placeholder__title
  margin: 8px 0
  height: 1.25em
  width: 80%
.placeholder__subtitle
  height: 1em
  width: 30%
</style>
