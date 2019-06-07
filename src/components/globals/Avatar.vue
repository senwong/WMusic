<template>
  <router-link class="avatar" :class="{ 'avatar--large': large }" :to="link">
    <ImageWithPlaceholder ratio="1:1" :al="name" :src="imgSrc" />
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";

@Component({
  components: { ImageWithPlaceholder }
})
export default class Avatar extends Vue {
  @Prop(String) name!: string;
  @Prop(String) imgSrc!: string;
  @Prop(Number) id!: number;
  @Prop(Boolean) large!: boolean;
  @Prop(Boolean) user!: boolean;
  @Prop(Boolean) artist!: boolean;

  get link(): string {
    const t = this.user ? "user" : this.artist ? "artist" : "/";
    return t === "/" ? t : `/${t}/${this.id}`;
  }
}
</script>

<style lang="sass" scoped>
.avatar
  display: block
  font-size: 16px
  width: 2em
  height: 2em
  border-radius: 9999px
  overflow: hidden
  &--large
    width: 3em
    height: 3em
</style>
