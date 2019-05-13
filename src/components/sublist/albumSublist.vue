<template>
  <div class="album-sublist">
    <ul class="album-sublist__container" v-if="!isLoading">
      <ListItem
        v-for="album in albums"
        :key="album.id"
        :to="`/album/${album.id}`"
        :imgSrc="album.picUrl | clipImage(150, 150)"
        :imgAlt="album.name"
      >
        <template v-slot:title>
          <router-link :to="`/album/${album.id}`">{{ album.name }}</router-link>
        </template>
        <template v-slot:subtitle_1>
          <ArtistsWithComma :artists="album.artists" aTagClass commaClass />
        </template>
        <template v-slot:subtitle_2
          >{{ album.size }}首</template
        >
      </ListItem>
    </ul>
    <div v-else>
      <ListItemPlaceholder v-for="(_, idx) in new Array(15)" :key="idx" />
    </div>
    <ErrorLabel class="error-label" :show="isError">{{ errorMsg }}</ErrorLabel>
    <PrevNextPagination
      :offset="offset"
      :limit="limit"
      :hasMore="hasMore"
      @offsetChange="handleOffsetChange"
    />
  </div>
</template>

<script lang="ts">
import { getAlbumSublist } from "@/service";
import ErrorLabel from "@/components/globals/ErrorLabel.vue";
import ListItem from "./listitem.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import PrevNextPagination from "@/components/globals/PrevNextPagination.vue";
import { Album } from "@/types";
import { Vue, Component } from "vue-property-decorator";
import ListItemPlaceholder from "./listitemPlaceholder.vue";

@Component({
  components: {
    ErrorLabel,
    ListItem,
    ArtistsWithComma,
    PrevNextPagination,
    ListItemPlaceholder
  }
})
export default class AlbumSubList extends Vue {
  albums: Album[] = [];

  isError: boolean = false;

  errorMsg: string = "获取收藏的专辑列表错误";

  offset: number = 0;

  readonly limit: number = 25;

  hasMore: boolean = false;
  isLoading: boolean = false;

  created() {
    this.isLoading = true;
    this.updateData();
  }

  updateData(): void {
    this.isLoading = true;
    getAlbumSublist(this.offset, this.limit).then(
      res => {
        this.albums = res.data.data;
        this.isLoading = false;
      },
      error => {
        if (error.msg) {
          this.errorMsg = error.msg;
        }
        this.isLoading = false;
      }
    );
  }

  handleOffsetChange(newOffset: number): void {
    this.offset = newOffset;
    this.updateData();
  }
}
</script>

<style lang="sass" scoped>
.album-sublist
  padding-bottom: 2em
.error-label
  margin-top: 3em
</style>
