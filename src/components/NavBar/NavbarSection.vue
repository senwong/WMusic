<template>
  <section class="nav-bar__section">
    <!-- 标题栏 -->
    <p class="nav-bar__section__title">
      <span class="nav-bar__section__title__left"
        ><slot name="title"></slot
      ></span>
      <SvgBtn
        v-if="toggle"
        class="nav-bar__section__title__right"
        :class="{
          'nav-bar__section__title__right--arrow-down': show
        }"
        @click.native="handelToggle"
      >
        <RightArrowIcon />
      </SvgBtn>
    </p>
    <!-- 内容list -->
    <div v-if="show">
      <slot></slot>
    </div>
  </section>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";

@Component({
  components: { SvgBtn, RightArrowIcon }
})
export default class NavbarSection extends Vue {
  @Prop(Boolean) toggle!: boolean;
  @Prop({ type: Boolean, default: false }) initHide!: boolean;
  isShowContent: boolean | null = null;
  handelToggle() {
    if (this.isShowContent == null) {
      this.isShowContent = this.initHide;
    } else {
      this.isShowContent = !this.isShowContent;
    }
  }
  get show(): boolean {
    if (this.isShowContent == null) {
      return !this.initHide;
    } else {
      return this.isShowContent;
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"
.nav-bar__section
  margin-top: 1em
  &__title
    font-size: 0.875em
    @include themify($themes)
      color: themed('text-color')
    &__right
      float: right
      transition: all 0.25s
      &--arrow-down
        transform: rotate(90deg)
</style>
