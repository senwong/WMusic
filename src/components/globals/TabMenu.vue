<template>
<div class="tab-menu-wrapper">
  <ul class="tab-menu" ref="tabMenu" :class="{'space-between': spaceBetween, 'flex-start': alignLeft}">
    <li
      class="tab-item"
      v-for='(item, idx) in list'
      :key="item.key"
      :class="{
        active: booleanActive(item.isActive, item),
        'margin-right': idx < list.length - 1 && alignLeft
      }"
      @click="item.onClick"
    >
      {{item.title}}
    </li>
  </ul>
</div>
</template>
<script>
/*
  list: [
    {
      key: key,
      isActive: boolean | function:boolean,
      onClick: function,
      title: String
    }
  ],
  style:
    space-between: default,
    align-left: boolean
    align-middle: boolean
    align-right: boolean,
  
*/
export default {
  props: {
    list: Array,
    spaceBetween: {
      type: Boolean,
      default: false,
    },
    alignLeft: {
      type: Boolean,
      default: false,
    },
    alignMiddle: {
      type: Boolean,
      default: false,
    },
    alignRight: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    booleanActive(val, item) {
      if (typeof val === 'function') return val(item);
      else return Boolean(val);
    }
  }
}
</script>

<style lang="sass" scoped>
.tab-menu-wrapper
  border-top: 1px solid rgb(224, 224, 224);
  border-bottom: 1px solid rgb(224, 224, 224);
  margin-top: 1em;
.tab-menu
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &.space-between
    justify-content: space-between;
  &.flex-start
    justify-content: flex-start;

.tab-item
  position: relative;
  flex: 0 0 auto;
  display: inline-block;
  padding: 0.7em 0.7em;
  min-width: 0;
  overflow: hidden;
  text-align: center;
  border-bottom: none;
  color: rgb(110, 110, 110);
  transition: color 200ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  cursor: pointer;
  overflow: visible;
  &.active
    color: rgb(0, 0, 0);
    &::after
      transform: scaleX(1);
  &:hover
    color: rgb(0, 0, 0);
    &::after
      transform: scaleX(1);
  &::after
    content: "";
    height: 2px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    background: rgb(0, 0, 0);
    transition: transform 400ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
    transform-origin: left center;
    transform: scaleX(0);
.margin-right
  margin-right: 2em;

</style>
