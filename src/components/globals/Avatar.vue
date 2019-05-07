<template>
  <div class="avatar__container">
    <ImageWithPlaceholder ratio="1:1" :al="name" :src="imgSrc" />
  </div>
</template>

<script>
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder";

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    imgSrc: {
      type: String,
      required: true
    }
  },
  components: { ImageWithPlaceholder }
};
</script>

<style lang="sass" scoped>
.avatar__container
  font-size: 16px
  width: 2em
  height: 2em
  border-radius: 9999px
  overflow: hidden
</style>
