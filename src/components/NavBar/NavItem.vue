<template>
  <router-link
    v-if="to"
    :to="to"
    :tag="as"
    class="nav-item"
    active-class="primary"
    :exact="exact"
  >
    <div class="nav-item__icon icon_m">
      <slot name="icon" />
    </div>
    <div class="nav-item__title">
      <slot />
    </div>
  </router-link>
  <component v-else :is="as" class="nav-item">
    <div class="nav-item__icon icon_m">
      <slot name="icon" />
    </div>
    <div class="nav-item__title">
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class NavItem extends Vue {
  @Prop() readonly to!: string | object | undefined;
  @Prop(Boolean) readonly exact!: boolean;
  @Prop(String) readonly as!: string;
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"
.nav-item
  display: flex
  align-items: center
  text-decoration: none
  padding: 5px
  border-radius: 2px
  margin-bottom: 5px
  transition: all 250ms
  cursor: pointer
  @include themify($themes)
    &:hover
      background-color: themed('background-color-hover')
    &.primary
      color: themed('primary-text-color')
      background-color: themed("primary-background-color")
    &.primary:hover
      background-color: themed("primary-background-color-hover")
.nav-item__icon
  display: inline-block
.icon_s
  width: 12px
  height: 12px
.icon_m
  width: 25px
  height: 25px

.nav-item__title
  margin-left: 1em
</style>
