<template>
  <div class="select-container">
    <div
      class="select"
      :class="{ active: isSpread }"
      @click="handleSelectClick"
    >
      {{ selectTitle }}
    </div>
    <div class="option-list-wrapper">
      <ul class="option-list" :class="{ active: isSpread }">
        <li
          class="option-item"
          v-for="option in options"
          :key="option.id"
          @click="handleOptionClick(option)"
        >
          {{ option.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";

import { Option } from "@/types";

@Component
export default class SelectInput extends Vue {
  isSpread: boolean = false;

  @Prop() readonly options!: Option[];
  @Prop() initOption!: Option;
  @Prop(Function) optionToTitle!: (opt: Option) => string;
  @Model("change") readonly selected!: Option;

  get selectTitle() {
    return this.selected && this.selected.title
      ? this.optionToTitle(this.selected)
      : this.initOption && this.initOption.value
      ? this.optionToTitle(this.initOption)
      : "请选择";
  }

  handleSelectClick() {
    this.isSpread = !this.isSpread;
  }

  handleOptionClick(option: Option) {
    this.isSpread = !this.isSpread;
    this.$emit("change", option);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.select
  border: 1px solid #e2e2e2
  border-radius: 0.2em
  width: fit-content
  padding: 0.4em
  cursor: pointer
  user-select: none
  -webkit-user-select: none
  transition: all 250ms

.select.active
  border-color: tomato

.option-list-wrapper
  position: relative

.option-list
  padding: 0
  display: block
  max-height: 200px
  overflow: scroll
  border: 1px solid #e2e2e2
  border-radius: 0.2em
  width: fit-content
  position: absolute
  left: 0
  top: 0
  background-color: white
  overscroll-behavior: none
  opacity: 0
  visibility: hidden

.option-list.active
  opacity: 1
  visibility: visible

.option-item
  list-style: none
  /* width: fit-content */
  text-align: left
  cursor: pointer
  padding: 0.4em
  white-space: nowrap
  transition: all 250ms

.option-item:hover
  background: tomato
</style>
