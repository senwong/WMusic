<template>
  <more-item @click.native="handleClick">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">下一首播放</span>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import { namespace, Mutation } from "vuex-class";

const playlist = namespace("playlist");
@Component({
  components: { DownloadIcon, MoreItem }
})
export default class AddToNext extends Vue {
  @Prop() track!: Track;
  @playlist.Mutation addToNext!: (track: Track) => void;
  handleClick() {
    this.addToNext(this.track);
  }
}
</script>
