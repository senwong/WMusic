<template>
  <FadeTransition>
    <Placeholder
      class="img-with-placeholder"
      :class="{ 'img-with-placeholder--row': row }"
      :abled="isLoading"
      :style="{ paddingBottom }"
    >
      <img
        v-if="row"
        class="img-with-placeholder__row-ph-img"
        :src="rowPhImg"
        alt="row placehoder image"
      />
      <img
        class="img-with-placeholder__img"
        v-show="!isLoading"
        :src="localSrc"
        @load="handleLoad"
        @error="handleError"
        :alt="alt"
      />
    </Placeholder>
  </FadeTransition>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Inject } from "vue-property-decorator";
import FadeTransition from "@/components/globals/FadeTransition.vue";
import Placeholder from "@/components/globals/Placeholder.vue";
import { namespace, State } from "vuex-class";
import { isElementInViewPort, isUndef, createImage } from "@/utilitys";

const mainScroll = namespace("mainScroll");
@Component({
  components: { FadeTransition, Placeholder }
})
export default class ImageWithPlaceholder extends Vue {
  isLoading: boolean = false;
  localSrc: string = "";
  @Prop(String) src!: string;
  @Prop(String) alt!: string;
  @Prop(String) ratio!: string;
  @Prop({ type: Boolean, default: true }) loadableFromParent!: boolean;
  @Prop({ type: Boolean, default: false }) row!: boolean;
  loadableFromScroll: boolean = false;
  @Inject({ default: 0 }) readonly animationEnded!: number;

  rowPhImg16_9 = createImage(16, 9);
  rowPhImg1_1 = createImage(1, 1);

  get rowPhImg() {
    const [width, height] = this.ratio.split(":").map(Number);
    return createImage(width, height);
  }

  @mainScroll.State scrollTop!: number;
  // 1:1
  // padding-bottom: 100%
  // 16:9
  // padding-bottom: 56.52%
  get paddingBottom(): string {
    if (this.row) {
      return "none";
    }
    let [width, height] = this.ratio.split(":").map(Number);
    width = Number(width);
    height = Number(height);
    return `${(height / width) * 100}%`;
  }
  @Watch("src")
  onSrcChange(val: string) {
    if (val.length > 0) {
      this.downloadImage();
    }
  }
  get loadable(): boolean {
    return this.loadableFromParent && this.loadableFromScroll;
  }
  @Watch("loadable")
  onLoadableChange(val: boolean) {
    this.downloadImage();
  }
  @Watch("scrollTop")
  onScrollTopChange(val: number) {
    if (!this.loadableFromScroll) {
      this.updateLoadableFromScroll();
    }
  }
  @Watch("animationEnded.value")
  onAnimationEndedChange(val: number) {
    this.updateLoadableFromScroll();
  }
  created() {
    window.addEventListener("resize", this.handleWindowResize);
  }
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
  handleWindowResize() {
    this.updateLoadableFromScroll();
  }
  mounted() {
    this.$nextTick(() => {
      this.updateLoadableFromScroll();
    });
  }
  updateLoadableFromScroll() {
    if (!this.loadableFromScroll) {
      this.loadableFromScroll = isElementInViewPort(this.$el);
    }
  }
  handleLoad() {
    this.isLoading = false;
  }
  handleError() {
    this.isLoading = false;
  }
  downloadImage() {
    if (isUndef(this.src) || this.src.length < 0) {
      return;
    }
    if (this.loadable && this.localSrc !== this.src) {
      this.isLoading = true;
      this.localSrc = this.src;
    }
  }
}
</script>

<style lang="sass" scoped>
.img-with-placeholder
  position: relative
  width: 100%
  &--row
    height: 100%
    width: auto
  &__img
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: auto
.img-with-placeholder--row
  .img-with-placeholder__img
    height: 100%
    width: auto
  .img-with-placeholder__row-ph-img
    width: auto
    height: 100%
    opacity: 0
</style>
