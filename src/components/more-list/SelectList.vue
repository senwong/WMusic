<template>
  <div class="select-list">
    <slot name="title"></slot>
    <div
      class="option-item"
      v-for="option in data"
      :key="option.id"
      :data-id="option.id"
      :class="{ selected: option.isSelected }"
    >
      <span class="title">{{ option.title }}</span>
      <div class="icon" v-show="option.isSelected">
        <CheckmarkIcon />
      </div>
    </div>
  </div>
</template>
<script>
import CheckmarkIcon from "@/components/SVGIcons/CheckmarkIcon";

export default {
  name: "SelectList",
  props: ["data"],
  components: { CheckmarkIcon },
  methods: {
    handleClick(optionEle) {
      const id = parseInt(optionEle.dataset.id);
      this.data.forEach(option => (option.isSelected = option.id === id));
      this.$emit("selected-change", id);
    }
  },
  mounted() {
    this.$el.querySelectorAll(".option-item").forEach(option => {
      option.addEventListener("click", () => {
        this.handleClick(option);
      });
    });
  }
};
</script>
<style lang="sass" scoped>
@import "../config.sass";
.select-list
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid $gray;
  border-radius: 6px;
  background-color: $whitegray2;
  padding: 4px;
.option-item
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  border-radius: 4px;
  padding: 6px;
  .title
    padding-right: 4em;
  .icon
    width: 12px;
    height: 12px;
    font-size: 0;
  &:hover
    background-color: $orange;
    color: white;
.selected
  color: $orange;
  &:hover
    color: white;
</style>
