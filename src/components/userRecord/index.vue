<template>
  <div>
    <TabMenu align-left :list="navTabList" />
    <ul class="record-list__container">
      <RecordItem
        v-for="r in records"
        :key="r.song.id"
        :playCount="r.playCount"
        :song="r.song"
        :score="r.score"
        @play="handlePlay"
      />
    </ul>
  </div>
</template>

<script>
import { getRecord } from '@/service';
import { mapState } from 'vuex';
import TabMenu from '@/components/globals/TabMenu';
import RecordItem from './RecordItem';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      // type=1 时只返回 weekData, type=0 时返回 allData
      type: 1,
      records: [],
    }
  },
  computed: {
    ...mapState('currentUser', {
      currentUserId: state => state.profile.userId,
    }),
    navTabList() {
      return [
        {
          key: 0,
          isActive: this.type == 1,
          onClick: () => this.type = 1,
          title: '一周',
        },
        {
          key: 1,
          isActive: this.type == 0,
          onClick: () => this.type = 0,
          title: '所有',
        },
      ];
    },
  },
  components: { TabMenu, RecordItem },
  mounted() {
    this.updateRecords();
  },
  watch: {
    type() {
      this.updateRecords();
    }
  },
  methods: {
    updateRecords() {
      getRecord(this.currentUserId, this.type).then(
        res => {
          if (this.type == 1) {
            this.records = res.data.weekData;
          }
          if (this.type == 0) {
            this.records = res.data.allData;
          }
        },
        error => {
          console.log('get record ', error);
        }
      )
    },
    ...mapMutations('playlist', [
      'setTracks'
    ]),
    handlePlay() {
      this.setTracks(this.records.map(r => r.song));
    }
  }
}
</script>

<style lang="sass" scoped>
.record-list__container
  padding: 2em;
  margin: 0 auto;
</style>
