<template>
  <div class="carousle-container">
    <Motion
      v-if="images.length > 0"
      :values="styleProps"
      tag="div"
      ref="container"
    >
      <template slot-scope="_styleProps">
        <a
          class="img-wrapper"
          v-for="(style, idx) in _styleProps"
          :key="idx"
          ref="items"
          :style="{
            transform: `translateX(${style.translateX}px) scale(${
              style.scale
            })`,
            transformOrigin: transformOrigins[idx],
            zIndex: zIndexs[idx],
            opacity: opacitys[idx]
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
        :class="{ spot_active: idx === midIdx }"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { getBanner } from "@/service";
import { Motion } from "vue-motion";
import ScaleableButton from "./ScaleableButton.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

interface Banner {
  imageUrl: string;
  targetId: number;
  targetType: TargetType;
  url: string | null;
}
interface BannerImage {
  id: number;
  src: string;
  url: string | null;
  targetId: number;
  targetType: TargetType;
}
enum TargetType {
  URL = 3000,
  PLAYLIST = 1000,
  ALBUM = 10,
  SONG = 1
}
interface StyleProp {
  scale: number;
  translateX: number;
}
const targetType = {
  3000: "url",
  1000: "playlist",
  10: "album",
  1: "song"
};
interface TransformValuesCalor {
  getTranslateX(itemWidth?: number): number;
  scale: number;
}
type position = "left" | "middle" | "right";
interface PositionedTransformValuesCalor {
  [index: string]: TransformValuesCalor;
  left: TransformValuesCalor;
  middle: TransformValuesCalor;
  right: TransformValuesCalor;
}

function getTransformValues(
  containerWidth: number
): PositionedTransformValuesCalor {
  return {
    left: {
      getTranslateX: () => 0,
      scale: 0.85
    },
    middle: {
      getTranslateX: (itemWidth: number): number =>
        (containerWidth - itemWidth) / 2,
      scale: 1
    },
    right: {
      getTranslateX: (itemWidth: number): number => containerWidth - itemWidth,
      scale: 0.85
    }
  };
}
@Component({
  components: { Motion, ScaleableButton, ImageWithPlaceholder }
})
export default class CarouselPanel extends Vue {
  images: BannerImage[] = [];

  midIdx = 1;

  styleProps: StyleProp[] = [];

  $refs!: {
    items: HTMLInputElement[];
  };

  created() {
    getBanner().then(res => {
      let uid = 1;
      res.data.banners.forEach((banner: Banner) => {
        const bannerImg: BannerImage = {
          id: uid,
          src: banner.imageUrl,
          url: this.formatUrl(banner),
          targetId: banner.targetId,
          targetType: banner.targetType
        };
        this.images.push(bannerImg);
        uid++;
        // 下载图片
        const img = document.createElement("img");
        img.src = banner.imageUrl;
      });
    });
  }

  leftClick() {
    this.midIdx = this.getNext(this.midIdx);
  }

  rightClick() {
    this.midIdx = this.getPrev(this.midIdx);
  }

  getPrev(index: number) {
    return (this.images.length - 1 + index) % this.images.length;
  }

  getNext(index: number) {
    return (this.images.length + 1 + index) % this.images.length;
  }

  handleWindowResize() {
    this.updateStyleProps();
  }

  formatUrl(banner: Banner) {
    const { targetType, targetId, url } = banner;
    switch (targetType) {
      case 3000:
        return url;
      case 1000:
        return targetId ? `/playlist/${targetId}` : "#";
      case 10:
        return targetId ? `/album/${targetId}` : "#";
      case 1:
        return targetId ? `/song/${targetId}` : "#";
      default:
        return "#";
    }
  }

  updateStyleProps(): void {
    const transformValues: PositionedTransformValuesCalor = getTransformValues(
      this.$el.clientWidth
    );
    this.styleProps = this.images.map((_, idx: number) => {
      let p;
      if (idx == this.midIdx) {
        p = "middle";
      } else if (this.prevStack.indexOf(idx) > -1) {
        p = "left";
      } else {
        p = "right";
      }

      const { getTranslateX, scale } = transformValues[p.toString()];
      const { items } = this.$refs;
      const itemWidth =
        items && items[idx] ? this.$refs.items[idx].clientWidth : 540;
      return {
        translateX: getTranslateX(itemWidth),
        scale
      };
    });
  }

  get zIndexs(): number[] {
    return this.images.map((_, idx) => {
      if (idx == this.midIdx) return 1;
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > -1) return -1 * leftIdx;
      const rightIdx = this.nextStack.indexOf(idx);
      return -1 * rightIdx;
    });
  }

  get transformOrigins(): string[] {
    return this.images.map((_, idx) => {
      if (idx == this.midIdx) return "center";
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > -1) return "center left";
      const rightIdx = this.nextStack.indexOf(idx);
      return "center right";
    });
  }

  get opacitys(): number[] {
    return this.images.map((_, idx) => {
      if (idx == this.midIdx) return 1;
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > 1) {
        return 0;
      }
      if (leftIdx < 2 && leftIdx > -1) {
        return 1;
      }
      const rightIdx = this.nextStack.indexOf(idx);
      if (rightIdx > 1) {
        return 0;
      }
      if (rightIdx < 2 && rightIdx > -1) {
        return 1;
      }
      console.log(
        `getOpacity(): index ${idx} are neither in prevStack nor in nextStack`
      );
      return 0;
    });
  }

  get prevStack() {
    const ret: number[] = [];
    const prevCount = (this.images.length - 1) / 2;
    new Array(prevCount).fill(true).reduce((acc, _) => {
      const prev = this.getPrev(acc);
      ret.push(prev);
      return prev;
    }, this.midIdx);
    return ret;
  }

  get nextStack() {
    const ret: number[] = [];
    const nextCount = this.images.length - (this.images.length - 1) / 2 - 1;
    new Array(nextCount).fill(true).reduce((acc, _) => {
      const next = this.getNext(acc);
      ret.push(next);
      return next;
    }, this.midIdx);
    return ret;
  }

  @Watch("images")
  onImagesChange() {
    this.updateStyleProps();
  }

  @Watch("midIdx")
  onmidIdxChange() {
    this.updateStyleProps();
  }

  mounted() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  beforeDestory() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
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
