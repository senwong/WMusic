<template>
  <div class="carousle-container">
    <Motion v-if="images.length > 0" :values="styleProps" tag="div" ref="container">
      <template slot-scope="_styleProps">
        <a
          class="img-wrapper"
          v-for="(style, idx) in _styleProps"
          :key="idx"
          :ref="'box' + idx"
          :style="{
            transform: `translateX(${style.translateX}px) scale(${style.scale})`,
            transformOrigin: transformOrigins[idx],
            zIndex: zIndexs[idx],
            opacity: opacitys[idx],
          }"
          :href="images[idx].url"
        >
          <img :src="images[idx].src" @load="loadedImgCount++">
        </a>
      </template>
    </Motion>
    <div class="button button_left" @click="leftClick">
      <svg class="i-chevron-left" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M20 30 L8 16 20 2"></path>
      </svg>
    </div>
    <div class="button button_right" @click="rightClick">
      <svg class="i-chevron-right" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M12 30 L24 16 12 2"></path>
      </svg>
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
  import { getBanner } from '../../service/Service.js'
  import {convertToHttps} from '@/utilitys'
  import { Motion } from "vue-motion";

  const targetType = {
    "3000": "url",
    "1000": "playlist",
    "10": "album",
    "1": "song"
  };
  function getWidth(ele) {
    return ele ? ele.clientWidth : 0;
  }
  const getTransformValues = containerEle => ({
    left: {
      getTranslateX: () => 0,
      scale: 0.85,
    },
    middle: {
      getTranslateX: ele => (getWidth(containerEle) - getWidth(ele)) / 2,
      scale: 1,
    },
    right: {
      getTranslateX: ele => getWidth(containerEle) - getWidth(ele),
      scale: 0.85,
    }
  });
export default {
  data() {
    return {
      images:[],
      midIdx: 1,
      loadedImgCount: 0,
      width: window.innerWidth,
    };
  },
  components: {
    Motion
  },
  created() {
    getBanner().then(res => {
      res = convertToHttps(res)
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
    handleWindowResize(event) {
      this.width = event.target.innerWidth;
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
  },
  computed: {
    prevCount: function() {
      return (this.images.length - 1) / 2;
    },
    nextCount: function() {
      return this.images.length - this.prevCount - 1;
    },
    prevStack: function() {
      const prevStack = [];
      new Array(this.prevCount).fill(true).reduce((acc, _) => {
        const prev = this.getPrev(acc);
        prevStack.push(prev);
        return prev;
      }, this.midIdx);
      return prevStack;
    },
    nextStack: function() {
      const nextStack = [];
      new Array(this.nextCount).fill(true).reduce((acc, _) => {
        const next = this.getNext(acc);
        nextStack.push(next);
        return next;
      }, this.midIdx);
      return nextStack;
    },
    styleProps: function() {
      if (this.loadedImgCount < this.images.length) {
        return this.images.map((_, idx) => ({translateX: 0, scale:1 }));
      }
      this.width += 0;
      const transformValues = getTransformValues(this.$refs.container ? this.$refs.container.$el : null);
      return this.images.map((_, idx) => {
        let p;
        if (idx == this.midIdx) {
          p = 'middle';
        } else if (this.prevStack.indexOf(idx) > -1){
          p = 'left'
        } else {
          p = 'right';
        };

        const { getTranslateX, scale } = transformValues[p];
        const imgWrapper = this.$refs["box" + idx]
          ? this.$refs["box" + idx][0]
          : null;
        return {
          translateX: getTranslateX(imgWrapper),
          scale: scale,
        };
      });
    },
    zIndexs: function() {
      return this.images.map((_, idx) => {
        if (idx == this.midIdx) return 1;
        const leftIdx = this.prevStack.indexOf(idx);
        if (leftIdx > -1) return -1 * leftIdx;
        const rightIdx = this.nextStack.indexOf(idx);
        if (rightIdx > -1) return -1 * rightIdx;
        console.error('index ' + idx + 'are neither in prevStack nor in nextStack');
      });
    },
    transformOrigins: function() {
      return this.images.map((_, idx) => {
        if (idx == this.midIdx) return 'center';
        const leftIdx = this.prevStack.indexOf(idx);
        if (leftIdx > -1) return 'center left';
        const rightIdx = this.nextStack.indexOf(idx);
        if (rightIdx > -1) return 'center right';
        console.error('index ' + idx + 'are neither in prevStack nor in nextStack');
      });
    },
    opacitys: function() {
      return this.images.map((_, idx) => {
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
        console.error('index ' + idx + 'are neither in prevStack nor in nextStack');
      });
    },
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
  font-size: 0;
  position: absolute;
  display: block;
  img
    height: 100%;
    width: auto;

.button
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  height: 100%;
  padding: 0 10px;
  color: white;
  background-color: transparent;
  z-index: 1;
  svg:hover
    transform: scale(1.2);
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
