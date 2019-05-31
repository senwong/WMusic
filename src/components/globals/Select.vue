<template>
  <div>
    <div class="select-container">
      <div
        class="select__element"
        @click="handleClick"
        :class="{ focused: showOptions }"
      >
        <span class="select__element__title">{{ title }}</span>
        <span class="select__element__icon" :class="{ rotated: showOptions }">
          <ChevronBottomIcon />
        </span>
      </div>
      <div class="options__position">
        <transition name="slide-fade">
          <div
            class="options__container"
            :class="{ 'is-top': top }"
            v-show="showOptions"
          >
            <div
              class="options__item"
              v-for="opt in options"
              :key="opt.key"
              @click="handleOptClick(opt)"
              :class="{ selected: opt.value == value }"
            >
              {{ opt.title }}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronBottomIcon from "@/components/SVGIcons/ChevronBottomIcon";

export default {
  name: "Select",
  props: {
    // option: {key, value, title}
    options: {
      type: Array
    },
    // selected from v-model
    value: {
      required: true
    },
    // options on the top of select element, because bottom has no room
    top: {
      type: Boolean
    }
  },
  data() {
    return {
      showOptions: false,
      // selected to emit
      valueTemp: null
    };
  },
  computed: {
    title() {
      if (!this.value || !this.options) {
        return "请选择";
      }
      const opt = this.options.find(opt => opt.value == this.value);
      return opt ? opt.title : "请选择";
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    valueTemp() {
      this.$emit("change", this.valueTemp);
    }
  },
  methods: {
    handleClick() {
      this.showOptions = !this.showOptions;
    },
    handleOptClick(opt) {
      this.valueTemp = opt.value;
      this.showOptions = false;
    }
  },
  components: { ChevronBottomIcon }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.select-container
  position: relative
  width: fit-content
  width: -moz-fit-content
  &.select_block
    width: 100%;
.select__element
  font-size: 16px
  line-height: 1.25em
  border: 1px solid #bbb
  display: block
  width: 100%
  padding: 0.2em 0.4em
  box-sizing: border-box
  border-radius: 0.4em
  cursor: pointer
  user-select: none
  -moz-user-select: none
  display: flex
  flex-directoin: row
  justify-content: flex-start
  align-items: center
  &.focused
    border-color: #3f72af
  .select__element__title
    flex: 1 1 auto
    margin-right: 1em
    white-space: nowrap
  .select__element__icon
    flex: 0 0 1em
    height: 1em
    transition: all 250ms
    transform-origin: center
    &.rotated
      transform: rotate(180deg)


.options__position
  position: relative
.options__container
  position: absolute
  top: 0.2em
  left: 0
  right: 0
  min-height: 100px
  max-height: 200px
  overflow: scroll
  border: 1px solid #eee
  background: #f9f7f7
  padding: 0.2em 0
  border-radius: 0.4em
  z-index: 1
  &.is-top
    bottom: 2em
    top: auto
.options__item
  cursor: pointer
  padding: 0.2em 0.5em
  color: #393e46
  border-radius: 0.2em
  &:hover
    background: #3f72af
  &.selected
    color: #222831

.slide-fade-enter-active,
.slide-fade-leave-active
  transition: all .25s

.slide-fade-enter,
.slide-fade-leave-to
  transform: translateY(-10px)
  opacity: 0

.slide-fade-enter-to,
.slide-fade-leave
  transform: translateY(0px)
  opacity: 1
</style>
