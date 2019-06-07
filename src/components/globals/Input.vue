<template>
  <div class="input">
    <input
      class="input__ele"
      :type="type"
      :class="{ 'input__ele--large': large }"
      :placeholder="placeholder"
      :value="value"
      @keydown.enter="$emit('enter')"
      @input="$emit('input', $event.target.value)"
    />
    <div class="input__hint" v-if="verify !== undefined">
      <div class="input__hint__done" v-if="verified"><DoneIcon /></div>
      <div class="input__hint__error" v-else>*</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import DoneIcon from "@/components/SVGIcons/Done.vue";

@Component({
  components: { DoneIcon }
})
export default class Input extends Vue {
  @Prop(String) type!: string;
  @Prop(Boolean) large!: boolean;
  @Prop(String) placeholder!: string;
  @Model("input", { type: String }) value!: string;
  @Prop(Function) verify!: (value: string) => boolean;
  get verified(): boolean {
    return this.verify(this.value);
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/themify.sass"
@import "Input.scss"

.input
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  &__ele
    flex: 1 1 auto
    font-size: 14px
    display: inline-block
    padding: 0.4em 0.8em
    border: 1px solid
    box-sizing: border-box
    transition: all 250ms
    border-radius: 0.2em
    @include themify($themes)
      border-color: themed('border-color')
      &:focus
        outline: none
        border-color: themed('border-color-focus')
    &--large
      font-size: 16px
  &__hint
    flex: 0 0 auto
    width: 1em
    height: 1em
    &__error
      color: red
      text-align: center
    &__done
      color: green
</style>
