<template>
  <div class="carousle-container">
    <div class="img-wrapper left">
      <img :src="leftImg.src" alt="">
    </div>
    <div class="img-wrapper middle" @click="handleBannerClick">
      <img :src="middleImg.src" alt="">
    </div>
    <div class="img-wrapper right">
      <img :src="rightImg.src" alt="">
    </div>
    <div class="button button_left" @click="leftMove">
      <svg class="i-chevron-left" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M20 30 L8 16 20 2"></path>
      </svg>
    </div>
    <div class="button button_right" @click="rightMove">
      <svg class="i-chevron-right" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M12 30 L24 16 12 2"></path>
      </svg>
    </div>
    <div class="spot-wrapper">
      <div 
        class="spot"
        v-for="img in imgs"
        :key="img.id"
        :class="{spot_active: img===middleImg}"
      ></div>
    </div>
  </div>
</template>
<script>
  import { getBanner } from '../../service/Service.js'
  import {convertToHttps} from '@/utilitys'
  const targetType = {
    "3000": "url",
    "1000": "playlist",
    "10": "album",
    "1": "song"
  };
  export default {
     data() {
       return {
         imgs:[],
         leftImg: {src: "", url: ""},
         middleImg: {src: "", url: ""},
         rightImg: {src: "", url: ""},
       }
     },
    created() {
      getBanner().then(res => {
        res = convertToHttps(res)
        let uid = 1;
        res.data.banners.forEach(banner => {
          this.imgs.push({
            id: uid,
            src: banner.picUrl,
            url: banner.url,
            targetId: banner.targetId,
            targetType: banner.targetType
          });
          uid++;
          // 下载图片
          var img = document.createElement('img');
          img.src = banner.picUrl;
        })
        this.leftImg = this.imgs[0];
        this.middleImg = this.imgs[1];
        this.rightImg = this.imgs[2];
      })
    },
    methods: {
      getNext(imgId) {
        const index = this.imgs.findIndex(img => img.id === imgId);
        return index === this.imgs.length - 1 ? this.imgs[0] : this.imgs[index + 1];
      },
      getPrevious(imgId) {
        const index = this.imgs.findIndex(img => img.id === imgId);
        return index === 0 ? this.imgs[this.imgs.length - 1] : this.imgs[index - 1];
      },
      leftMove() {
        this.leftImg = this.middleImg;
        this.middleImg = this.rightImg;
        this.rightImg = this.getNext(this.rightImg.id);
      },
      rightMove() {
        this.rightImg = this.middleImg;
        this.middleImg = this.leftImg;
        this.leftImg = this.getPrevious(this.leftImg.id);
      },
      handleBannerClick() {
        switch (this.middleImg.targetType) {
          case "3000":
            window.open(this.middleImg.url);
            break;
          case "1000":
            this.middleImg.targetId && this.$router.push({ path: `/playlist/${this.middleImg.targetId}` });
            break;
          case "10":
            this.middleImg.targetId && this.$router.push({ path: `/album/${this.middleImg.targetId}` });
            break;
          case "1":
            this.middleImg.targetId && this.$router.push({ path: `/song/${this.middleImg.targetId}` });
            break;
          default:
            console.log("error banner type", this.middleImg)
        }
      }
    }
  }
</script>
<style lang="sass" scoped>
.carousle-container
  height: 200px;
  position: relative;
.img-wrapper
  height: 100%;
  font-size: 0;
  position: absolute;
  img
    height: 100%;
    width: auto;
.left, .right
  top: 50%;
  transform: translateY(-50%);
  height: 85%;  
.left
  left: 0;
.middle
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
.right
  right: 0;

.button
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  height: 100%;
  padding: 0 10px;
  color: white;
  background-color: transparent;
  svg:hover
    transform: scale(1.2);
.button_left
  left: 0;
.button_right
  right: 0;

.spot-wrapper
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 4;
.spot
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background: transparent;
  border: 1px solid white;
  margin-right: 1em;
.spot_active
  background: white;
</style>
