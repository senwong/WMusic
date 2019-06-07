<template>
  <FadeTransition>
    <div class="global-notification" v-if="isVisible">{{ msg }}</div>
  </FadeTransition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import FadeTransition from "@/components/globals/FadeTransition.vue";

const notification = namespace("notification");

@Component({
  components: { FadeTransition }
})
export default class GlobalNotification extends Vue {
  @notification.State isVisible!: boolean;
  @notification.State msg!: string;
  @notification.State timestamp!: number;
  @notification.Mutation setVisibility!: (v: boolean) => void;
  @Watch("timestamp")
  onVisibilityChange() {
    this.setVisibility(true);
    setTimeout(() => {
      this.setVisibility(false);
    }, 800);
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"

.global-notification
  min-width: 250px
  min-height: 150px
  opacity: 0.8
  position: fixed
  left: 50%
  top: 10em
  font-size: 1.125em
  transform: translateX(-50%)
  border-radius: 10px
  display: flex
  align-items: center
  justify-content: center
  @include themify($themes)
    color: themed('secondary-text-color')
    background: themed('secondary-background-color')
    box-shadow: 0 0 6px 4px themed('box-shadow-color')
</style>
