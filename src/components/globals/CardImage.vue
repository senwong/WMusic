<template>
  <div class="card-image" :class="{ 'card-image--row': row }">
    <WithHoverMask
      class="card-image__image"
      :class="{ 'card-image__image--rounded': radius }"
    >
      <router-link :to="href" slot="controlls" class="card-image__controlls">
        <!-- 收藏 -->
        <SvgBtn
          large
          v-if="fav"
          class="card-image__control-item"
          @click.native.stop.prevent="fav.onClick"
        >
          <FavIcon />
        </SvgBtn>
        <!-- 播放 -->
        <SvgBtn
          large
          primary
          v-if="play"
          class="card-image__control-item"
          @click.native.stop.prevent="play.onClick"
        >
          <PlayArrow />
        </SvgBtn>
        <!-- 更多 -->
        <BtnWithPopupMenu class="card-image__control-item" v-if="more">
          <template slot="btn">
            <SvgBtn large @click.native.prevent="more.onClick">
              <MoreIcon />
            </SvgBtn>
          </template>
          <template slot="menu">
            <MoreList class="card-image__more-menu">
              <MoreItem>
                <DownloadIcon slot="icon" />
                <span slot="txt" class="txt">加入歌单</span>
              </MoreItem>
            </MoreList>
          </template>
        </BtnWithPopupMenu>
      </router-link>
      <ImageWithPlaceholder :src="src" :alt="alt" :ratio="ratio" :row="row" />
    </WithHoverMask>
    <div class="card-image__left-top" v-if="$slots.leftTop">
      <slot name="leftTop"></slot>
    </div>
    <div class="card-image__right-top" v-if="$slots.rightTop">
      <slot name="rightTop"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import PlayArrow from "@/components/SVGIcons/PlayArrow.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import WithHoverMask from "@/components/globals/WithHoverMask.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import { ControlBtn } from "@/types";
import MoreList from "@/components/more-list/MoreList.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";

@Component({
  components: {
    FavIcon,
    PlayArrow,
    MoreIcon,
    ImageWithPlaceholder,
    WithHoverMask,
    SvgBtn,
    BtnWithPopupMenu,
    MoreList,
    MoreItem,
    DownloadIcon
  }
})
export default class CardImage extends Vue {
  @Prop() fav?: ControlBtn;

  @Prop() play?: ControlBtn;

  @Prop() more?: ControlBtn;

  @Prop(String) href!: string;

  // image href
  @Prop(String) src!: string;

  // image src
  @Prop(String) alt!: string;

  // image alt
  @Prop(String) ratio!: string;

  // width:height
  @Prop(Boolean) radius!: boolean;
  @Prop({ type: Boolean, default: false }) row!: boolean;
}
</script>
<style lang="sass" scoped>
.card-image
  width: 100%
  position: relative
  &--row
    height: 100%
    width: auto
  &__image
    &--rounded
      overflow: hidden
      border-radius: 15px
      transform: translateZ(0)
  &__controlls
    width: 100%
    height: 100%
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
  &__control-item
    color: white
    margin: 5px
  &__more-menu
    color: #333
  &__left-top, &__right-top
    position: absolute
    top: 0
  &__left-top
    left: 0
  &__right-top
    right: 0
</style>
