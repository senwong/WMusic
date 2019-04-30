<template>
  <div class="sublist__page-container">
    <TabMenu class="sublist__tab-menu" align-left :list="navList" />
    <component class="sublist__list" :is="currentComponent" />
  </div>
</template>

<script>
import TabMenu from '@/components/globals/TabMenu';
import AlbumSublist from './albumSublist';
import ArtistSublist from './artistSublist';
import MvSublist from './mvSublist';

const contentTypes = ['专辑', '歌手', 'MV'];
export default {
  components: { TabMenu, AlbumSublist, ArtistSublist, MvSublist },
  data() {
    return {
      // current content type: 专辑: 0, 歌手: 1, MV: 2
      currentType: 0,
    };
  },
  computed: {
    // navgator header 专辑 歌手 MV
    navList() {
      return contentTypes.map((title, idx) => ({
        key: idx,
        isActive: this.currentType == idx,
        onClick: () => this.currentType = idx,
        title,
      }));
    },
    currentComponent() {
      const typeComponents= ['AlbumSublist', 'ArtistSublist', 'MvSublist'];
      return typeComponents[this.currentType];
    }
  }
}
</script>

<style lang="sass" scoped>
.sublist__page-container
  font-size: 16px
.sublist__tab-menu
  margin-left: 2em
.sublist__list
  margin-top: 2em  
</style>
