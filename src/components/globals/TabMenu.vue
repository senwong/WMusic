<script lang="ts">
/*
  list: [
    {
      key: key,
      isActive: function:boolean,
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
import { Vue, Component, Prop } from "vue-property-decorator";
import { TabMenuItem } from "@/types";

@Component
export default class TabMenu extends Vue {
  @Prop() list!: TabMenuItem[];

  @Prop(Boolean) spaceBetween!: boolean;

  @Prop(Boolean) alignLeft!: boolean;

  @Prop(Boolean) alignMiddle!: boolean;

  @Prop(Boolean) alignRight!: boolean;
  @Prop({ type: Boolean, default: false }) isLink!: boolean;

  renderItem(item: TabMenuItem, h: any) {
    return h(
      this.isLink ? "router-link" : "li",
      {
        key: item.key,
        staticClass: "tab-menu__item",
        attrs: this.isLink && {
          to: item.href,
          "exact-active-class": "tab-menu__item--active"
        },
        class: !this.isLink && {
          "tab-menu__item--active": item.isActive
        },
        on: !this.isLink && { click: item.onClick }
      },
      [item.title]
    );
  }
  renderList(h: any) {
    return h(
      "ul",
      {
        staticClass: "tab-menu__list",
        class: {
          "tab-menu__list--space-between": this.spaceBetween,
          "tab-menu__list--flex-start": this.alignLeft
        }
      },
      (this.list as TabMenuItem[]).map(item => this.renderItem(item, h))
    );
  }
  render(h: any) {
    return h(
      "div",
      {
        staticClass: "tab-menu"
      },
      [this.renderList(h)]
    );
  }
}
</script>

<style lang="sass" scoped>
@import '@/style/theme.sass'

.tab-menu
  border-top: 1px solid #666
  border-bottom: 1px solid #666
  margin-top: 1em
  &__list
    display: flex
    flex-direction: row
    justify-content: space-between
    &--space-between
      justify-content: space-between
    &--flex-start
      justify-content: flex-start

  &__item
    position: relative
    flex: 0 0 auto
    display: inline-block
    padding: 0.7em 0.7em
    min-width: 0
    overflow: hidden
    text-align: center
    border-bottom: none
    color: rgb(110, 110, 110)
    transition: color 200ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s
    cursor: pointer
    overflow: visible
    @include themify($themes)
      &:hover
        color: themed("text-color")
      &--active
        color: themed("text-color")
        &::after
          transform: scaleX(1)
    &:hover::after
        transform: scaleX(1)
    &::after
      content: ""
      height: 2px
      width: 100%
      position: absolute
      left: 0
      bottom: -1px
      @include themify($themes)
        background: themed('text-color')
      transition: transform 400ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s
      transform-origin: left center
      transform: scaleX(0)
    &:not(:last-child)
      margin-right: 2em
</style>
