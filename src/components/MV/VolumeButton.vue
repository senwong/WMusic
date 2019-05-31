<template>
  <button class="button js-button">
    <svg
      height="100%"
      version="1.1"
      viewBox="0 0 36 36"
      width="100%"
      fill="white"
    >
      <use class="ytp-svg-shadow" xlink:href="#full-volume-icon"></use>
      <defs>
        <clipPath id="slash-clip">
          <path
            id="slash-clip-path"
            ref="slashClipPath"
            d="M10,0 V36 H36 V0 H0 Z M 9.5,9 l 17,17 -1.8,1.8 -17,-17 1.5,-1.5 Z"
          ></path>
        </clipPath>
        <g id="full-volume-icon" data-state="full">
          <path
            class="main"
            d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z
              M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71
              L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23
              L19,11.29 Z"
            clip-path="url(#slash-clip)"
          />
          <path class="slash" d="M 9,9 l 0,0 -1.27,1.27 0,0 1.5,-1.5 Z" />
          <path
            class="clip"
            d="M0,0 V36 H36 V0 H0 Z M 9.5,9 l 0,0 -1.8,1.8 0,0 1.5,-1.5 Z"
          />
        </g>
        <g id="half-volume-icon" data-state="half">
          <path
            class="main"
            d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z
              M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71
              L19,24.71 C21.89,23.85 24,21.17 24,18 C24,14.83 21.89,12.15 19,11.29
              L19,11.29 Z"
            clip-path="url(#slash-clip)"
          />
          <path class="slash" d="M 9,9 l 0,0 -1.27,1.27 0,0 1.5,-1.5 Z" />
          <path
            class="clip"
            d="M0,0 V36 H36 V0 H0 Z M 9.5,9 l 0,0 -1.8,1.8 0,0 1.5,-1.5 Z"
          />
        </g>
        <g id="zero-volume-icon" data-state="zero">
          <path
            class="main"
            d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z
              M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71
              L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23
              L19,11.29 Z"
            clip-path="url(#slash-clip)"
          />
          <path class="slash" d="M 9,9 l 17,17 -1.27,1.27 -17,-17 1.5,-1.5 Z" />
          <path
            class="clip"
            d="M0,0 V36 H36 V0 H0 Z M 9.5,9 l 17,17 -1.8,1.8 -17,-17 1.5,-1.5 Z"
          ></path>
        </g>
      </defs>
    </svg>
  </button>
</template>
<script>
import { select } from "d3-selection";
import "d3-transition";

export default {
  name: "VolumeButton",
  props: ["volume"],
  data() {
    return {
      animationDuration: 200
    };
  },
  mounted() {
    this.element = this.$el;
    (this.states = {
      full: {
        nextState: "zero",
        mainEl: this.$el.querySelector("#full-volume-icon .main"),
        slashEl: this.$el.querySelector("#full-volume-icon .slash"),
        clipEl: this.$el.querySelector("#full-volume-icon .clip")
      },
      half: {
        nextState: "full",
        mainEl: this.$el.querySelector("#half-volume-icon .main"),
        slashEl: this.$el.querySelector("#half-volume-icon .slash"),
        clipEl: this.$el.querySelector("#half-volume-icon .clip")
      },
      zero: {
        nextState: "full",
        mainEl: this.$el.querySelector("#zero-volume-icon .main"),
        slashEl: this.$el.querySelector("#zero-volume-icon .slash"),
        clipEl: this.$el.querySelector("#zero-volume-icon .clip")
      }
    }),
      this.init();
  },
  watch: {
    volume(val) {
      if (val <= 100 && val > 50) {
        console.log("go to full");
        this.goToState("full");
      } else if (val > 0 && val <= 50) {
        console.log("go to half");
        this.goToState("half");
      } else {
        console.log("go to zero");
        this.goToState("zero");
      }
    }
  },
  methods: {
    init() {
      this.setInitialState();
      this.replaceUseEl();
      // this.element.addEventListener("click", this.goToNextState);
    },

    setInitialState() {
      const initialIconRef = this.element
        .querySelector("use")
        .getAttribute("xlink:href");
      const stateName = this.element
        .querySelector(initialIconRef)
        .getAttribute("data-state");
      this.setState(stateName);
    },

    replaceUseEl() {
      select(this.element.querySelector("use")).remove();
      const g = select(this.element.querySelector("svg"))
        .append("g")
        .attr("class", "js-icon");
      g.append("path")
        .attr("class", "main")
        .attr("d", this.state.mainEl.getAttribute("d"))
        .attr("clip-path", this.state.mainEl.getAttribute("clip-path"));
      g.append("path")
        .attr("class", "slash")
        .attr("d", this.state.slashEl.getAttribute("d"));
      select(this.element.querySelector("svg"))
        .select("#slash-clip-path")
        .attr("d", this.state.clipEl.getAttribute("d"));
    },

    goToNextState() {
      this.setState(this.state.nextState);
      const g = select(this.element.querySelector(".js-icon"));
      g.select(".main")
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.state.mainEl.getAttribute("d"))
        .attr("clip-path", this.state.mainEl.getAttribute("clip-path"));
      g.select(".slash")
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.state.slashEl.getAttribute("d"));
      select(this.element.querySelector("svg"))
        .select("#slash-clip-path")
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.state.clipEl.getAttribute("d"));
    },
    goToState(state) {
      this.setState(state);
      const g = select(this.element.querySelector(".js-icon"));
      g.select(".main")
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.state.mainEl.getAttribute("d"))
        .attr("clip-path", this.state.mainEl.getAttribute("clip-path"));
      g.select(".slash")
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.state.slashEl.getAttribute("d"));
      select(this.element.querySelector("svg"))
        .select("#slash-clip-path")
        .transition()
        .duration(this.animationDuration)
        .attr("d", this.state.clipEl.getAttribute("d"));
    },
    setState(stateName) {
      this.state = this.states[stateName];
    }

    // stateIconPath: function() {
    //   return this.state.iconEl.getAttribute("d");
    // },
    // stateMainPath: function() {
    //   return this.state.mainEl.getAttribute("d");
    // },
    // stateSlashPath: function() {
    //   return this.state.slashEl.getAttribute("d");
    // }
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
.ytp-svg-shadow
  stroke: #000;
  stroke-opacity: .15;
  stroke-width: 2px;
  fill: none;

.ytp-svg-fill
  fill: #fff;
</style>
