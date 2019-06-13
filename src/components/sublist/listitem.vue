<template>
  <router-link class="list-item__container" :to="to">
    <div class="list-item__cover">
      <ImageWithPlaceholder :src="imgSrc" :alt="imgAlt" ratio="1:1" />
    </div>
    <div class="list-item__title">
      <slot name="title"></slot>
    </div>
    <div class="list-item__subtitle-1">
      <slot name="subtitle_1"></slot>
    </div>
    <div class="list-item__subtitle-2">
      <slot name="subtitle_2"></slot>
    </div>
  </router-link>
</template>

<script>
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder";

export default {
  props: {
    imgSrc: {
      required: true,
      type: String
    },
    imgAlt: {
      required: true,
      type: String
    },
    to: {
      type: String,
      required: true
    }
  },
  components: { ImageWithPlaceholder }
};
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"

.list-item__container
  font-size: 16px
  align-items: center
  padding: 1em 2em
  display: grid
  grid-template-columns: auto 2fr 1fr auto
  transition: all 250ms
  @include themify($themes)
    &:nth-of-type(2n)
      background: themed("secondary-background-color")
    &:hover
      background: themed("secondary-background-color-hover")
  .list-item__cover
    margin-right: 1em
    border-radius: 0.2em
    width: 3em
    height: 3em
    border-radius: 0.3em
    overflow: hidden
  .list-item__subtitle-1,
  .list-item__subtitle-2
    font-size: 0.875em
    color: #546e7a
</style>
