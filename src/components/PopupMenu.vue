<template>
<div class="popup-menu" :class="{hide: !isShow}" :style="styleObj">
  <slot></slot>
</div>
</template>
<script>
  export default {
    props: ['target', 'direction', 'enableClick'],
    data() {
      return{
        isShow: false,
        styleObj: {
          top: "",
          bottom: "",
          right: "",
          left: "",
        },
      }
    },
    methods: {
      toggleShowMenu(e) {
        this.calcPosition();
        this.isShow = !this.isShow;
      },
      hideMenu() {
        this.isShow = false;
      },
      registerClick() {
        if(!this.target) return;
        document.body.addEventListener("click", this.handleClick)
        this.beforeDestroy = () => {
          this.traget.removeEventListener("click", this.toggleShowMenu);
        }
      },
      calcPosition() {
        if(!this.target) return;
        const {top, left, bottom, right, width, height} = this.target.getBoundingClientRect(),
          viewportHeight = document.documentElement.clientHeight,
          viewportWidth = document.documentElement.clientWidth,
          selfPosition = this.$el.getBoundingClientRect(),
          selfHeight = selfPosition.height,
          selfWidth = selfPosition.width;
        const topSpace = top,
          bottomSpace = viewportHeight - top - height,
          leftSpace = left,
          rightSpace = viewportWidth - left - width;
          
        if (this.direction == "top") {
          this.styleObj.top = "";
          this.styleObj.bottom = bottomSpace + height + 10 +"px";          
        } else if(this.direction == "bottom") {
          this.styleObj.top = topSpace + height + 10 +"px";
          this.styleObj.bottom = "";          
        } else if(bottomSpace >= topSpace){
          this.styleObj.top = topSpace + height + 10 +"px";
          this.styleObj.bottom = "";
        } else {
          this.styleObj.top = "";
          this.styleObj.bottom = bottomSpace + height + 10 +"px";          
        }

        if(leftSpace >= rightSpace) {
          this.styleObj.right = Math.max(rightSpace, 0) + "px";
          this.styleObj.left = "";
        } else {
          this.styleObj.right = "";
          this.styleObj.left = leftSpace + "px";
        }
      },
      withIn(item, container) {
        return container === item || (container && container.contains(item))
      },
      handleClick(e) {
        // if e.target in this.target : toggleShow
        // if e.target not in  popupmenu and not in this.target: hide menu
        if (this.withIn(e.target, this.target)) {
          this.toggleShowMenu()
        } else if( !this.withIn(e.target, this.$el)
                  || (!this.enableClick && this.withIn(e.target, this.$el)) ) {
          this.hideMenu()
        }
      }
    },
    watch: {
      target: function() {
        this.isShow = false;
        this.registerClick();
        this.calcPosition();
      }
    }
  }

</script>
<style lang="sass" scoped>
@import "config.sass";
.popup-menu
  position: fixed;
  z-index: 99;
.hide
  opacity: 0;
  visibility: hidden;
</style>

