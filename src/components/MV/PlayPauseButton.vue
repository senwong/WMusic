<template>
<button class="button js-button">
  <svg width="100%" height="100%" viewBox="0 0 36 36" fill="white">
    <defs>
      <path id="pause-icon" data-state="playing" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />
      <path id="play-icon"  data-state="paused"  d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" />
    </defs>
    <use xlink:href="#play-icon" />
  </svg>
</button>
</template>
<script>
import { select } from "d3-selection";
import "d3-transition";

export default {
  name: "PlayPauseButton",
  data() {
    return {
      animationDuration: 200
    };
  },
  mounted() {
    this.element = this.$el;
    (this.states = {
      playing: {
        nextState: "paused",
        iconEl: this.$el.querySelector("#pause-icon")
      },
      paused: {
        nextState: "playing",
        iconEl: this.$el.querySelector("#play-icon")
      }
    }),
    this.init();
  },
  methods: {
    init: function() {
      this.setInitialState();
      this.replaceUseEl();
      this.element.addEventListener("click", this.goToNextState);
    },

    setInitialState: function() {
      var initialIconRef = this.element
        .querySelector("use")
        .getAttribute("xlink:href");
      var stateName = this.element
        .querySelector(initialIconRef)
        .getAttribute("data-state");
      this.setState(stateName);
    },

    replaceUseEl: function() {
      select(this.element.querySelector("use")).remove();
      select(this.element.querySelector("svg"))
        .append("path")
        .attr("class", "js-icon")
        .attr("d", this.stateIconPath());
    },

    goToNextState: function() {
      this.setState(this.state.nextState);

      select(this.element.querySelector(".js-icon"))
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.stateIconPath());
    },

    setState: function(stateName) {
      this.state = this.states[stateName];
    },

    stateIconPath: function() {
      return this.state.iconEl.getAttribute("d");
    }
  }
};
</script>
<style lang="sass" scoped>
.button
  padding: 0;
  width: 46px;
  height: 100%;
  border: 0;
  background-color: transparent;
  outline: none;
</style>
