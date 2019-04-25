<template>
  <div class="carousle-container">
    <Motion v-if="images.length > 0" :values="styleProps" tag="div" ref="container">
      <template slot-scope="_styleProps">
        <a
          class="img-wrapper"
          v-for="(style, idx) in _styleProps"
          :key="idx"
          ref="items"
          :style="{
            transform: `translateX(${style.translateX}px) scale(${style.scale})`,
            transformOrigin: getTransformOrigin(idx),
            zIndex: getZIndex(idx),
            opacity: getOpacity(idx),
          }"
          :href="images[idx].url | convert2Https"
        >
          <ImageWithPlaceholder
            :src="images[idx].src | convert2Https"
            ratio="27:10"
          />
        </a>
      </template>
    </Motion>
    <div class="button button_left" @click="leftClick">
      <ScaleableButton position="left" />
    </div>
    <div class="button button_right" @click="rightClick">
      <ScaleableButton position="right" />
    </div>
    <div class="spot-wrapper">
      <div 
        class="spot"
        v-for="(img, idx) in images"
        :key="img.id"
        :class="{spot_active: idx===midIdx}"
      ></div>
    </div>
  </div>
</template>
<script>
import { getBanner } from '../../service'
import { Motion } from "vue-motion";
import ScaleableButton from './ScaleableButton.vue';
import ImageWithPlaceholder from '@/components/globals/ImageWithPlaceholder';

const targetType = {
  "3000": "url",
  "1000": "playlist",
  "10": "album",
  "1": "song"
};
function getWidth(ele) {
  return ele ? ele.clientWidth : 0;
}
const getTransformValues = containerWidth => ({
  left: {
    getTranslateX: () => 0,
    scale: 0.85,
  },
  middle: {
    getTranslateX: itemWidth => (containerWidth - itemWidth) / 2,
    scale: 1,
  },
  right: {
    getTranslateX: itemWidth => containerWidth - itemWidth,
    scale: 0.85,
  }
});
export default {
  data() {
    return {
      images:[],
      midIdx: 1,
      styleProps: [],
    };
  },
  components: { Motion, ScaleableButton, ImageWithPlaceholder  },
  created() {
    getBanner().then(res => {
      let uid = 1;
      res.data.banners.forEach(banner => {
        this.images.push({
          id: uid,
          src: banner.imageUrl,
          url: this.formatUrl(banner),
          targetId: banner.targetId,
          targetType: banner.targetType
        });
        uid++;
        // 下载图片
        var img = document.createElement('img');
        img.src = banner.imageUrl;
      });
    })
  },
  methods: {
    leftClick() {
      this.midIdx = this.getNext(this.midIdx);
    },
    rightClick() {
      this.midIdx = this.getPrev(this.midIdx);
    },
    getPrev(index) {
      return (this.images.length - 1 + index) % this.images.length;
    },
    getNext(index) {
      return (this.images.length + 1 + index) % this.images.length;
    },
    handleWindowResize() {
      this.updateStyleProps();
    },
    formatUrl({ targetType, targetId, url }) {
      switch (targetType) {
        case 3000:
          return url;
          break;
        case 1000:
          return targetId ? `/playlist/${targetId}` : '#';
          break;
        case 10:
          return targetId ? `/album/${targetId}` : '#';
          break;
        case 1:
          return targetId ? `/song/${targetId}` : '#';
          break;
        default:
          return '#';
      }
    },
    updateStyleProps() {
      const transformValues = getTransformValues(this.$el.clientWidth);
      this.styleProps = this.images.map((_, idx) => {
        let p;
        if (idx == this.midIdx) {
          p = 'middle';
        } else if (this.prevStack.indexOf(idx) > -1){
          p = 'left'
        } else {
          p = 'right';
        };

        const { getTranslateX, scale } = transformValues[p];
        const itemWidth = this.$refs.items && this.$refs.items[idx]
          ? this.$refs.items[idx].clientWidth
          : 540;
        return {
          translateX: getTranslateX(itemWidth),
          scale,
        };
      });
    },
    getZIndex(idx) {
      idx = Number(idx);
      if (idx == this.midIdx) return 1;
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > -1) return -1 * leftIdx;
      const rightIdx = this.nextStack.indexOf(idx);
      if (rightIdx > -1) return -1 * rightIdx;
      alert('getZIndex(): index ' + idx + ' are neither in prevStack nor in nextStack');
    },
    getTransformOrigin(idx) {
      idx = Number(idx);
      if (idx == this.midIdx) return 'center';
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > -1) return 'center left';
      const rightIdx = this.nextStack.indexOf(idx);
      if (rightIdx > -1) return 'center right';
      alert('getTransformOrigin(): index ' + idx + ' are neither in prevStack nor in nextStack');
    },
    getOpacity(idx) {
      idx = Number(idx);
      if (idx == this.midIdx) return 1;
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > 1) {
        return 0;
      } else if (leftIdx < 2 && leftIdx > -1) {
        return 1;
      }
      const rightIdx = this.nextStack.indexOf(idx);
      if (rightIdx > 1){
        return 0;
      } else if (rightIdx < 2 && rightIdx > -1) {
        return 1;
      }
      alert('getOpacity(): index ' + idx + ' are neither in prevStack nor in nextStack');
    },
  },
  computed: {
    prevStack: function() {
      const ret = [];
      const prevCount = (this.images.length - 1) / 2;
      new Array(prevCount).fill(true).reduce((acc, _) => {
        const prev = this.getPrev(acc);
        ret.push(prev);
        return prev;
      }, this.midIdx);
      return ret;
    },
    nextStack: function() {
      const ret = [];
      const nextCount = this.images.length - ((this.images.length - 1) / 2) - 1;
      new Array(nextCount).fill(true).reduce((acc, _) => {
        const next = this.getNext(acc);
        ret.push(next);
        return next;
      }, this.midIdx);
      return ret;
    },
  },
  watch: {
    images(val) {
      this.updateStyleProps();
    },
    midIdx() {
      this.updateStyleProps();
    }
  },
  mounted: function() {
    window.addEventListener('resize', this.handleWindowResize);
  },
  beforeDestory: function() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
}
</script>
<style lang="sass" scoped>
.carousle-container
  height: 200px;
  position: relative;
.img-wrapper
  height: 100%;
  width: 540px;
  font-size: 0;
  position: absolute;
  display: block;
  img
    height: 100%;
    width: auto;

.button
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 1;
.button_left
  left: 0;
.button_right
  right: 0;

.spot-wrapper
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 4;
.spot
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background: transparent;
  border: 1px solid white;
  margin-right: 1em;
.spot_active
  background: white;
</style>
