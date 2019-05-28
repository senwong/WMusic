<template>
  <div class="input__container">
    <input
      class="input__ele"
      :type="type"
      :class="{ 'input-large': large }"
      :placeholder="placeholder"
      :value="value"
      @keydown.enter="$emit('enter')"
      @input="$emit('input', $event.target.value)"
    />
    <div class="input__hint" v-if="verify !== undefined">
      <div class="input__done" v-if="verified"><DoneIcon /></div>
      <div class="input__error" v-else>*</div>
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
.input__container
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
.input__ele
  flex: 1 1 auto
  font-size: 14px
  display: inline-block
  padding: 0.4em 0.8em
  border: 1px solid #eee
  box-sizing: border-box
  transition: all 250ms
  border-radius: 0.2em
  &:focus
    outline: none
    border-color: #777
  &.input-large
    font-size: 16px
.input__hint
  flex: 0 0 auto
  width: 1em
  height: 1em
.input__error
  color: red
  text-align: center
.input__done
  color: green
</style>
