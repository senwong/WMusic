<template>
  <div>
    <UserMediaCardGrid
      :users="users"
      :more="more"
      :offset="offset"
      :limit="limit"
      @offsetChange="handleOffsetChange"
    />
    <ErrorLabel class="get-user-follows-fail" :show="isGetUserFollowsFail">
      获取用户关注错误。
    </ErrorLabel>
  </div>
</template>

<script>
import UserMediaCardGrid from "./UserMediaCardGrid";
import { getUserFollows } from "@/service";
import ErrorLabel from "@/components/globals/ErrorLabel";

// getUserFollows limit in request
export default {
  name: "UserFollows",
  data() {
    return {
      users: [],
      more: true,
      offset: 0,
      uid: null,
      limit: 30,
      isGetUserFollowsFail: false
    };
  },
  components: { UserMediaCardGrid, ErrorLabel },
  created() {
    this.uid = this.$route.params.id;
    this.updateUsers();
  },
  watch: {
    offset() {
      this.updateUsers();
    }
  },
  methods: {
    updateUsers() {
      if (!this.uid) return;
      getUserFollows(this.uid, this.offset, this.limit).then(
        res => {
          this.users = res.data.follow;
          this.more = res.data.more;
          this.isGetUserFollowsFail = false;
        },
        error => (this.isGetUserFollowsFail = true)
      );
    },
    handleOffsetChange(val) {
      this.offset = val;
    }
  }
};
</script>
<style lang="sass" scoped>
.get-user-follows-fail
  margin: 3em auto;
</style>
