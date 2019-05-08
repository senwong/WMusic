<template>
  <UserMediaCardGrid
    :users="users"
    :offset="offset"
    :limit="limit"
    :more="hasMore"
    @offsetChange="handleOffsetChange"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UserMediaCardGrid from "@/components/user/UserMediaCardGrid.vue";
import { getPlaylistSubers } from "@/service";
import { User } from "@/types";

@Component({
  components: { UserMediaCardGrid }
})
export default class Subscribers extends Vue {
  @Prop(Number) id!: number;
  users: User[] = [];
  offset: number = 0;
  readonly limit: number = 20;
  hasMore: boolean = false;
  created() {
    this.updateData();
  }
  updateData() {
    getPlaylistSubers(this.id, this.offset, this.limit).then(
      res => {
        this.users = res.data.subscribers;
        this.hasMore = res.data.more;
      },
      error => {
        // TODO
      }
    );
  }
  handleOffsetChange(offset: number) {
    this.offset = offset;
    this.updateData();
  }
}
</script>

<style></style>
