<template>
  <div>用户主页, id{{userId}}</div>
</template>
<script>
  export default {
    name: "UserDetail",
    data() {
      return {
        userId: 0,
      }
    },
    created() {
      this.userId = this.$route.params.id;
    },
  }
</script>
<style lang="sass" scoped>

</style>
