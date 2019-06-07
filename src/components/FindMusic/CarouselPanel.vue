<template>
  <div class="carousle-panel">
    <Motion
      v-if="images.length > 0"
      :values="styleProps"
      tag="div"
      ref="container"
    >
      <template slot-scope="_styleProps">
        <a
          class="carousle-panel__item"
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
            :loadableFromParent="isImgLoadable(Number(idx))"
          />
        </a>
      </template>
    </Motion>
    <SvgBtn xlarge class="carousle-panel__left" @click.native="leftClick">
      <LeftArrowIcon />
    </SvgBtn>
    <SvgBtn xlarge class="carousle-panel__right" @click.native="rightClick">
      <RightArrowIcon />
    </SvgBtn>
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
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { getBanner } from "@/service";
import { Motion } from "vue-motion";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import LeftArrowIcon from "@/components/SVGIcons/LeftArrowIcon.vue";
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";

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

interface TransformValuesCalor {
  getTranslateX(itemWidth?: number): number;
  scale: number;
}
interface PositionedTransformValuesCalor {
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
  components: {
    Motion,
    ImageWithPlaceholder,
    LeftArrowIcon,
    RightArrowIcon,
    SvgBtn
  }
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
    const { middle, left, right } = getTransformValues(this.$el.clientWidth);
    this.styleProps = this.images.map((_, idx: number) => {
      const { getTranslateX, scale } =
        idx == this.midIdx // middle
          ? middle
          : this.prevStack.indexOf(idx) > -1 // left
          ? left
          : right;
      const { items } = this.$refs;
      const itemWidth = items && items[idx] ? items[idx].clientWidth : 540;
      return {
        translateX: getTranslateX(itemWidth),
        scale
      };
    });
  }
  imgLoadableCache = new Map();
  isImgLoadable(idx: number) {
    return this.imgLoadableCache.get(idx);
  }
  updateImgLoadable(idx: number) {
    if (!this.imgLoadableCache.get(idx)) {
      this.imgLoadableCache.set(idx, this.calcImgLoadable(idx));
    }
  }
  calcImgLoadable(idx: number): boolean {
    const isLoaded = this.imgLoadableCache.get(idx);
    if (isLoaded) {
      return isLoaded;
    }
    if (idx === this.midIdx) {
      return true;
    }
    const leftIdx = this.prevStack.indexOf(idx);
    if (leftIdx > -1) {
      return leftIdx < 1;
    }
    const rightIdx = this.nextStack.indexOf(idx);
    if (rightIdx > -1) {
      return rightIdx < 1;
    }
    return false;
  }

  imagesMap<T>(
    left: (idx: number) => T,
    middle: (idx: number) => T,
    right: (idx: number) => T,
    defaultValue: T
  ): T[] {
    return this.images.map((_, idx: number) => {
      if (idx == this.midIdx) {
        return middle(idx);
      }
      const leftIdx = this.prevStack.indexOf(idx);
      if (leftIdx > -1) {
        return left(leftIdx);
      }
      const rightIdx = this.nextStack.indexOf(idx);
      if (rightIdx > -1) {
        return right(rightIdx);
      } else {
        return defaultValue;
      }
    });
  }

  get zIndexs(): number[] {
    const left = (idx: number) => -1 * idx;
    const middle = () => 1;
    const right = (idx: number) => -1 * idx;
    const defaultValue = 0;
    return this.imagesMap<number>(left, middle, right, defaultValue);
  }

  get transformOrigins(): string[] {
    const left = (idx: number) => "center left";
    const middle = () => "center";
    const right = (idx: number) => "center right";
    const defaultValue = "center left";
    return this.imagesMap<string>(left, middle, right, defaultValue);
  }

  get opacitys(): number[] {
    const left = (idx: number) => (idx < 2 ? 1 : 0);
    const middle = () => 1;
    const right = (idx: number) => (idx < 2 ? 1 : 0);
    const defaultValue = 1;
    return this.imagesMap<number>(left, middle, right, defaultValue);
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
    this.images.map((_, idx: number) => this.updateImgLoadable(idx));
  }

  @Watch("midIdx")
  onMidIdxChange(val: number, oldVal: number) {
    this.updateStyleProps();
    // move to left
    if (val === this.getNext(oldVal)) {
      this.updateImgLoadable(this.getNext(val));
    } else {
      this.updateImgLoadable(this.getPrev(val));
    }
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
.carousle-panel
  height: 200px
  position: relative
  &__item
    height: 100%
    width: 540px
    font-size: 0
    position: absolute
    display: block
    img
      height: 100%
      width: auto
  &__left, &__right
    position: absolute
    top: 50%
    transform: translateY(-50%)
    z-index: 1
  &__left
    left: 0.5em
  &__right
    right: 0.5em

.spot-wrapper
  position: absolute
  bottom: 4px
  left: 0
  width: 100%
  display: flex
  justify-content: center
  z-index: 4
.spot
  width: 0.5em
  height: 0.5em
  border-radius: 50%
  background: transparent
  border: 1px solid white
  margin-right: 1em
.spot_active
  background: white
</style>
