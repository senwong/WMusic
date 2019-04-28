<template>
<div class="card-item-container">
  <WithHoverMask class="item-cover" :class="{radius: radius}">
    <router-link :to="href" slot="controlls" class="item-controlls">
      <!-- 收藏 -->
      <button v-if="fav" class="button_icon large control__item " @click.stop.prevent="fav.onClick">
        <FavIcon />
      </button>
      <!-- 播放 -->
      <button v-if="play" class="button_icon large control__play control__item" @click.stop.prevent="play.onClick">
        <PausedIcon />
      </button>
      <!-- 更多 -->
      <button v-if="more" class="button_icon large control__item" @click.stop.prevent="more.onClick" >
        <MoreIcon />
      </button>
    </router-link>
    <ImageWithPlaceholder
      :src="src"
      :alt="alt"
      :ratio="ratio"
    />
  </WithHoverMask>
  <div class="left-top" v-if="$slots.leftTop">
    <slot name="leftTop"></slot>
  </div>
  <div class="right-top" v-if="$slots.rightTop">
    <slot name="rightTop"></slot>
  </div>
</div>
</template>
<script>
import FavIcon from '../SVGIcons/FavIcon';
import PausedIcon from '../SVGIcons/PausedIcon';
import MoreIcon from '../SVGIcons/MoreIcon';
import ImageWithPlaceholder from '@/components/globals/ImageWithPlaceholder';
import WithHoverMask from '@/components/globals/WithHoverMask';

export default {
  props: {
    fav: Object, // fav icon
    play: Object, // play icon
    more: Object, // more icon
    href: String, // image href
    src: String, // image src
    alt: String, // image alt
    ratio: String, // width:height
    radius: Boolean,
  },
  components: {
    FavIcon,
    PausedIcon,
    MoreIcon,
    ImageWithPlaceholder,
    WithHoverMask,
  },
}
</script>
<style lang="sass" scoped>
@import '../../style/colors.sass';
.card-item-container
  width: 100%;
  position: relative; 
.list-item
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
.item-cover
  &.radius
    overflow: hidden;
    border-radius: 15px;

.item-controlls
  display: block;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

.img-wrapper
  display: block;
  // height: 100%;
  width: 100%;
  box-sizing: border-box;

.control__item
  color: white;
  margin: 5px;
.control__play
  padding: 5px;
  border-radius: 50%;
  background: $primary;

.left-top, .right-top
  position: absolute;
  top: 0;
.left-top
  left: 0;
.right-top
  right: 0;
</style>
