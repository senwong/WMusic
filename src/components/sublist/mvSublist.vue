<template>
  <div class="mv-sublist">
    <div class="mv-sublist__container" v-if="!isLoading">
      <CardItem v-for="mv in mvs" :key="mv.id" :card="mv" />
    </div>
    <div class="mv-sublist__container" v-else>
      <div
        v-for="(_, idx) in new Array(20)"
        :key="idx"
        class="placeholder__wrapper"
      >
        <Placeholder class="placeholder__cover" />
        <Placeholder class="placeholder__title" />
        <Placeholder class="placeholder__subtitle" />
      </div>
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
import CardItem from "@/components/globals/CardItem.vue";
import { getMvSublist } from "@/service";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import PrevNextPagination from "@/components/globals/PrevNextPagination.vue";
import { Vue, Component } from "vue-property-decorator";
import { MvCard, MvType, MediaCardItem, MediaCardType } from "@/types";
import Placeholder from "@/components/globals/Placeholder.vue";

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
    PrevNextPagination,
    Placeholder
  }
})
export default class MvSubList extends Vue {
  mvs: MediaCardItem[] = [];

  errorMsg: string = "获取mv收藏列表错误";

  isError: boolean = false;

  hasMore: boolean = false;

  offset: number = 0;

  readonly limit: number = 25;
  isLoading: boolean = false;
  created() {
    this.updateData();
  }

  updateData() {
    this.isLoading = true;
    getMvSublist(this.offset, this.limit).then(
      res => {
        this.mvs = res.data.data.map(
          (mv: MvType): MediaCardItem => ({
            type: MediaCardType.Mv,
            picUrl: mv.cover,
            title: mv.name,
            id: mv.id,
            subTitle: mv.artistName,
            subLink: mv.artistId && `/artist/${mv.artistId}`,
            playCount: mv.playCount
          })
        );
        this.hasMore = res.data.hasMore;
        this.isLoading = false;
      },
      error => {
        this.isError = true;
        if (error.msg) {
          this.errorMsg = error.msg;
        }
        this.isLoading = false;
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
  grid-gap: 2em
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
  padding: 0 2em
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
