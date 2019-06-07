<template>
  <div class="textarea-input">
    <textarea
      type="text"
      class="textarea-input__textarea"
      :placeholder="placeholder"
      v-model.trim="content"
      @focus="handleFocus"
      @blur="handleBlur"
      :autofocus="autofocus"
      @keydown="handleKeydown"
    />
    <div
      class="textarea-input__fake-bot"
      :class="{ 'textarea-input__fake-bot--show': isFocused }"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";

@Component
export default class TextareaInput extends Vue {
  isFocused: boolean = false;

  @Prop(String) readonly placeholder!: string;
  @Prop(Boolean) readonly autofocus!: boolean;
  @Model("input", { type: String }) readonly content!: string;

  handleFocus(e: Event) {
    this.isFocused = true;
    this.$emit("focus", e);
  }
  handleBlur(e: Event) {
    this.isFocused = false;
    this.$emit("blur", e);
  }
  handleKeydown(e: Event) {
    this.$emit("keydown", e);
  }
}
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

.textarea-input
  display: inline-block
  position: relative
  border-bottom: 1px solid #eee
  width: 100%
  &__textarea
    padding: 0
    display: block
    height: 100%
    width: 100%
    border: none
    font-size: 14px
    resize: none
    &:focus
      outline: none
    @include themify($themes)
      color: themed('text-color')
      background-color: themed("background-color")
  &__fake-bot
    height: 2px
    transition: all 250ms
    @include themify($themes)
      background-color: themed('text-color')
    tranform-origin: center
    transform: scaleX(0)
    position: absolute
    bottom: -1px
    left: 0
    width: 100%
    &--show
      transform: scaleX(1)
</style>
