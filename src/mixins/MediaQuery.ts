// mixin.js
import Vue from "vue";
import Component from "vue-class-component";
import { namespace, State, Getter, Mutation } from "vuex-class";
import { ScreenSize } from "@/store/modules/mediaQuery";
import { debounceTime } from "@/utilitys";
const mediaQuery = namespace("mediaQuery");

@Component
export default class MediaQueryMixin extends Vue {
  @mediaQuery.Mutation setSize!: (payload: ScreenSize) => boolean;

  debouncedHandleWindowResize = debounceTime(
    this.handleWindowResize.bind(this),
    150
  );
  handleWindowResize() {
    this.updateMediaQuery();
  }
  updateMediaQuery() {
    const wide = 1000,
      middle = 600;
    if (window.matchMedia(`(min-width: ${wide}px)`).matches) {
      this.setSize(ScreenSize.Wide);
      return;
    } else if (window.matchMedia(`(min-width: ${middle}px)`).matches) {
      this.setSize(ScreenSize.Middle);
    } else {
      this.setSize(ScreenSize.Small);
    }
  }
  created() {
    window.addEventListener("resize", this.debouncedHandleWindowResize);
    this.updateMediaQuery();
  }
  beforeDestroy() {
    window.removeEventListener("resize", this.debouncedHandleWindowResize);
  }
}
