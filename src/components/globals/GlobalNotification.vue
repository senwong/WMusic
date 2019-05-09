<template>
  <div>
    <FadeTransition>
      <div class="global-notification__wrapper" v-if="isVisible">{{ msg }}</div>
    </FadeTransition>
  </div>
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
.global-notification__wrapper
  min-width: 250px
  min-height: 150px
  background: #333
  opacity: 0.8
  color: #eee
  position: fixed
  left: 50%
  top: 10em
  font-size: 1.125em
  transform: translateX(-50%)
  border-radius: 10px
  box-shadow: 0 0 6px 4px rgba(0, 0, 0, 0.4)
  display: flex
  align-items: center
  justify-content: center
</style>
