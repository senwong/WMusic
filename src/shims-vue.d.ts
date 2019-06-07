declare module "*.vue" {
  import Vue from "vue";

  export default Vue;
}
declare module "*.png";

interface Document {
  msExitFullscreen: any;
  mozCancelFullScreen: any;
  mozExitFullscreen: any;
  webkitExitFullscreen: any;
  fullscreenElement: Element;
  webkitFullscreenElement: Element;
  mozFullScreenElement: Element;
  msFullscreenElement: Element;
}
