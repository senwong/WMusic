<template>
  <div class="rank-item">
    <div class="rank-title">
      <span class="rank-index text-gray">{{formatIndex(index + 1)}}</span>
      <svg class="text-gray" v-if="index + 1 == rankItem.lastRank" viewBox="0 0  32 10" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M 8 5 H24 Z"/>
      </svg>
      <span v-else-if="index + 1 < rankItem.lastRank">
        <svg id="i-arrow-top" viewBox="0 0 32 32" width="12" height="12" fill="none" stroke="#f00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M6 10 L16 2 26 10 M16 2 L16 30" />
        </svg>
      </span>
      <span v-else-if="index + 1 > rankItem.lastRank && rankItem.lastRank <= 10">
        <svg id="i-arrow-bottom" viewBox="0 0 32 32" width="12" height="12" fill="none" stroke="#00f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M6 22 L16 30 26 22 M16 30 L16 2" />
        </svg>
      </span>
      <span v-else class="rank-index_new">new</span>
    </div>
    <div class="media-container">
      <!-- hover时显示播放 -->
      <div class="media__control">
        <!-- 播放 -->
        <div class="control__play control__item">
          <svg class="i-caret-right" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M10 30 L26 16 10 2 Z"></path>
          </svg>
        </div>
      </div>
      <router-link :to= "'/mvplay/'+ rankItem.id" class="img-wrapper">
        <img :src="rankItem.cover" alt="">
      </router-link>
    </div>
    <div class="media__info">
      <div class="media__info__name">{{rankItem.name}}</div>
      <div class="media__info__artist">{{rankItem.artistName}}</div>
      <p class="media__info__desc text-gray">{{rankItem.briefDesc}}</p>
    </div>
  </div>
</template>
<script>
  import { formatDate } from "@/utilitys"
  export default {
    name: "RankItem",
    props: ['rankItem', 'index'],
    data() {
      return {
        formatDate: formatDate,
      }
    },
    methods: {
      formatIndex(i) {
        return i < 10 ? '0'+i : i
      }
    }
  }
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
.text-gray
  color: #000;
  opacity: 0.3;
// .card-container
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
//   gap: 2em;
//   flex-wrap: wrap
//   justify-content: space-between;


// .rank-container
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   grid-auto-rows: 150px;
//   gap: 2em;
//   flex-wrap: wrap
//   justify-content: space-between;
.rank-item
  display: flex;
  overflow: hidden;
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
    font-size: 0;

.img-wrapper
  display: inline-block;
  position: relative;
  height: 100%;
  width: 267px;
  user-select: none;
  &::after
    content: "";
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $mask;
    border-radius: 15px;
  &:hover::after
    display: block;
  img
    height: 100%;
    width: 100%;
    border-radius: 15px;
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