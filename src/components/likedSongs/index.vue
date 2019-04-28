<template>
  <div>
    喜欢的音乐
  </div>
</template>

<script>
import { getLikelist } from '@/service';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      likelist: [],
    }
  },
  computed: {
    ...mapState('currentUser', {
      currentUserId: state => state.profile.userId,
    })
  },
  mounted() {
    getLikelist(this.currentUserId).then(
      res => {
        console.log('get likelist', res);
      },
      error => {
        console.log('get likelist', error);
      }
    )
  }
}
</script>

<style>

</style>
