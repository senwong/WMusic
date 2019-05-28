<template>
  <div class="card-item-container">
    <WithHoverMask class="item-cover" :class="{ radius: radius }">
      <router-link :to="href" slot="controlls" class="item-controlls">
        <!-- 收藏 -->
        <SvgBtnWrapper
          large
          v-if="fav"
          class="control__item"
          @click.native.stop.prevent="fav.onClick"
        >
          <FavIcon />
        </SvgBtnWrapper>
        <!-- 播放 -->
        <SvgBtnWrapper
          large
          primary
          v-if="play"
          class="control__item"
          @click.native.stop.prevent="play.onClick"
        >
          <PausedIcon />
        </SvgBtnWrapper>
        <!-- 更多 -->
        <BtnWithPopupMenu class="control__item" v-if="more">
          <template slot="btn">
            <SvgBtnWrapper large @click.native.prevent="more.onClick">
              <MoreIcon />
            </SvgBtnWrapper>
          </template>
          <template slot="menu">
            <MoreList class="more__popup-menu">
              <MoreItem>
                <DownloadIcon slot="icon" />
                <span slot="txt" class="txt">加入歌单</span>
              </MoreItem>
            </MoreList>
          </template>
        </BtnWithPopupMenu>
      </router-link>
      <ImageWithPlaceholder :src="src" :alt="alt" :ratio="ratio" />
    </WithHoverMask>
    <div class="left-top" v-if="$slots.leftTop">
      <slot name="leftTop"></slot>
    </div>
    <div class="right-top" v-if="$slots.rightTop">
      <slot name="rightTop"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import PausedIcon from "@/components/SVGIcons/PausedIcon.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import WithHoverMask from "@/components/globals/WithHoverMask.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import { ControlBtn } from "@/types";
import MoreList from "@/components/more-list/MoreList.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";

@Component({
  components: {
    FavIcon,
    PausedIcon,
    MoreIcon,
    ImageWithPlaceholder,
    WithHoverMask,
    SvgBtnWrapper,
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
}
</script>
<style lang="sass" scoped>
@import '../../style/colors.sass'
.card-item-container
  width: 100%
  position: relative
.list-item
  display: flex
  flex-direction: column
  position: relative
  user-select: none
.item-cover
  &.radius
    overflow: hidden
    border-radius: 15px
    transform: translate3d(0, 0, 0);

.item-controlls
  width: 100%
  height: 100%
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center

.img-wrapper
  display: block
  // height: 100%
  width: 100%
  box-sizing: border-box

.control__item
  color: white
  margin: 5px

.left-top, .right-top
  position: absolute
  top: 0
.left-top
  left: 0
.right-top
  right: 0
.more__popup-menu
  color: #333
</style>
