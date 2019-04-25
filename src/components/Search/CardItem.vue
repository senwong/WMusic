<template>
  <div class="artist-item" :class=shapeClass>
    <a
      :href="link"
      class="artist-pic"
      :style="{'background-image': 'url(' + picUrl + ')'}">
      <div class="artist-pic-mask">
        <div class="artist-pic-play"></div>
      </div>
    </a>
    <div class="artist-info">
      <a class="title" :href="link">{{title}}</a><br>
      <a
        class="sub-title"
        v-for="subTitle in subTitles"
        :key="subTitle.id"
        :href="subLinks[subTitle.id]"
      >{{subTitle.txt}}</a>
    </div>
  </div>
</template>
<script>
  export default {
    name: "CardItem",
    props: ["link", "picUrl", "title", "subTitles", "subLinks", "shape"],
    computed:{
      shapeClass() {
        return {
          round: this.shape == "round",
          square: this.shape == "square",
          rectangle: this.shape == "rectangle",
        }
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
a
  text-decoration: none;
  color: inherit;
.artist-item
  display: inline-block;
  width: 10em;
  margin-bottom: 1em;
  &.round .artist-pic
    border-radius: 5em;
  &.rectangle
    width: 17.778em;
  &:not(:last-child)
    margin-right: 2em;
  &:hover
    .artist-pic-mask
      visibility: visible;
      background-color: $mask;

.artist-pic
  width: 100%;
  height: 10em;
  display: inline-block;
  position: relative;
  border-radius: 0;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  .artist-pic-mask
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    visibility: hidden;
    background-color: transparent;
    transition: all 0.2s;
    .artist-pic-play
      width: 3.5em;
      height: 3.5em;
      border-radius: 50%;
      border: 1px solid #fff;
      transform-origin: center center;
      transition: transform 0.3s;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -1.75em;
      margin-left: -1.75em;
      display: inline-block;
      background: url('../../assets/triangle-right-fill.svg') no-repeat  center / 60%;
      &:hover
        transform: scale(1.1, 1.1);
        
.artist-info
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .title
    display: inline-block;
    margin: 0.2em 0 0.2em;
  .sub-title
    font-size: 87.5%;
    color: $black-8;
</style>

