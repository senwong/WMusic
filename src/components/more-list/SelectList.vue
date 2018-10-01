<template>
  <div class="select-list">
    <slot name="title"></slot>
    <div
      class="option-item"
      v-for="option in data"
      :key="option.id"
      :data-id="option.id"
      :class="{selected: option.isSelected}"
    >
      <span class="title">{{option.title}}</span>
      <div class="icon">
        <svg v-show="option.isSelected" class="i-checkmark" viewBox="0 0 32 32" width="12" height="12" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M2 20 L12 28 30 4"></path>
        </svg>
      </div>
  </div>
  </div>
</template>
<script>
  export default {
    name: "SelectList",
    props: ['data'],
    methods: {
      handleClick(optionEle) {
        const id = parseInt(optionEle.dataset.id);
        this.data.forEach( option => option.isSelected = option.id === id ? true : false);
        this.$emit('selected-change', id);
      },
    },
    mounted() {
      this.$el.querySelectorAll(".option-item").forEach(option =>{
        option.addEventListener('click', () => {
          this.handleClick(option)
        })
      })
    }
  }
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

