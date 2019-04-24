<template>
  <div class="rank-item">
    <div class="rank-title">
      <span class="rank-index text-gray">{{formatIndex(index + 1)}}</span>
      <UnderscoreIcon class="text-gray rank_icon" v-if="index + 1 == rankItem.lastRank"/>
      <ArrowTopIcon class="rank_icon" v-else-if="index + 1 < rankItem.lastRank" />
      <ArrowBottomIcon class="rank_icon" v-else-if="index + 1 > rankItem.lastRank && rankItem.lastRank <= 10" />
      <span v-else class="rank-index_new">new</span>
    </div>
    <div class="media-container">
      <!-- hover时显示播放 -->
      <div class="media__control">
        <!-- 播放 -->
        <button class="button_icon large control__play">
          <PausedIcon />
        </button>
      </div>
      <a :to= "'/mvplay/'+ rankItem.id" class="img-wrapper">
        <ImageWithPlaceholder
          :src="rankItem.cover | convert2Https | clipImage(640, 360)"
          :alt="rankItem.name"
          ratio="16:9"
        />
      </a>
    </div>
    <div class="media__info">
      <div class="media__info__name">{{rankItem.name}}</div>
      <div class="media__info__artist">{{rankItem.artistName}}</div>
      <p class="media__info__desc text-gray">{{rankItem.briefDesc}}</p>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { formatDate } from "@/utilitys"
import UnderscoreIcon from '@/components/SVGIcons/UnderscoreIcon';
import ArrowTopIcon from '@/components/SVGIcons/ArrowTopIcon';
import ArrowBottomIcon from '@/components/SVGIcons/ArrowBottomIcon';
import PausedIcon from '@/components/SVGIcons/PausedIcon';
import ImageWithPlaceholder from '@/components/globals/ImageWithPlaceholder';

export default {
  name: "RankItem",
  props: ['rankItem', 'index'],
  components: {
    UnderscoreIcon,
    ArrowTopIcon,
    ArrowBottomIcon,
    PausedIcon,
    ImageWithPlaceholder,
  },
  methods: {
    formatDate,
    formatIndex(i) {
      return i < 10 ? '0'+i : i
    },
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
.text-gray
  color: #000;
  opacity: 0.3;
.rank-item
  display: flex;
  overflow: hidden;
  .rank_icon
    width: 1em;
    height: 1em;
  .rank-title
    font-size: 24px;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 1.5em;
    .rank-index_new
      font-size: 12px;
      color: green;
  .media-container
    position: relative;
    max-width: 100%;
    &:hover .media__control
      visibility: visible;
  .media__info
    flex: 1 1 auto;
    padding: 0 10px;
    overflow: hidden;
    .media__info__name, .media__info__artist, .media__info__desc
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    .media__info__name
      opacity: 0.9;
      padding: 6px 0;
    .media__info__artist
      opacity: 0.7;
      padding: 6px 0;
    .media__info__desc
      font-size: 14px;
  // font-size: 0;
.media__control
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  left: 50%;
  visibility: hidden;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 9;
  &:hover
    visibility: visible;
  &:hover ~ .img-wrapper::after
    display: block;
  .control__play
    padding: 5px;
    border-radius: 50%;
    background: $orange;

.img-wrapper
  display: inline-block;
  position: relative;
  width: 267px;
  user-select: none;
  border-radius: 15px;
  overflow: hidden;
  &::after
    content: "";
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $mask;
  &:hover::after
    display: block;
  img
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    width: 100%;
    
// .button-bg-right
//   background-image: url("../../assets/chevron-right-black.svg");
//   background-position: right 3px center;
//   background-size: 12px 12px;
//   padding-right: 18px;
//   background-repeat: no-repeat;
//   font-size: 12px;
//   border: 1px solid rgba(0, 0, 0, 0.3);
//   border-radius: 3px;
//   margin-left: auto;
//   cursor: pointer;
//   &:focus, &:active
//     border: 1px solid rgba(0, 0, 0, 0.3);;
//     outline: none;
</style>