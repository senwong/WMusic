<template>
  <div class="main-wrapper">
    <div class="container">
      <h1>最新MV</h1>
      <div class="card-container">
        <CardItem
          v-for="mv in newMVList"
          :key="mv.id"
          :card="mv"
          cardType="mvplay"
        />
      </div>
      <div class="title">
        <span class="text-h1">MV排行榜</span>
        <span class="text-gray">{{ formatDate(updateTime) }}更新</span>
        <router-link to="/mv/rank" class="button-bg-right">更多</router-link>
      </div>
      <div class="rank-container">
        <RankItem
          v-for="media in MVrankList"
          :key="media.id"
          :rank-item="media"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getNewMV, getPersonalizedMV, getMVrank } from "@/service";
import CardItem from "./CardItem.vue";
import RankItem from "./RankItem.vue";
import { formatDate } from "@/utilitys";
import { Vue, Component } from "vue-property-decorator";
import { Rank, MvCard } from "@/types";

@Component({
  components: { CardItem, RankItem }
})
export default class Mv extends Vue {
  newMVList: MvCard[] = [];

  MVrankList: Rank[] = [];

  updateTime: number = 0;

  formatDate = formatDate;

  created() {
    getNewMV().then(res => {
      if (res.data.code == 200) {
        this.newMVList = res.data.data;
      } else {
        alert(`获取最新MV数据错误${res.data}`);
      }
    });
    getMVrank().then(res => {
      if (res.data.code == 200) {
        this.updateTime = res.data.updateTime;
        this.MVrankList = res.data.data.map((rank: Rank, i: number) => ({
          rank: i,
          ...rank
        }));
      } else {
        alert(`获取MV排行榜数据错误${res.data}`);
      }
    });
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
@import "@/style/theme.sass"

a
  text-decoration: none;
  color: inherit;

.title
  margin: 12px 0;
  display: flex;
  border-bottom: 1px solid $black-3;
  padding-bottom: 4px;
  align-items: flex-end;
.text-gray
  @include themify($themes)
    color: themed('secondary-text-color')
.text-h1
  font-size: 28px;
  padding-right: 10px;
.card-container
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  grid-gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;


.rank-container
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-auto-rows: 150px;
  grid-gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
.button-bg-right
  background-image: url("../../assets/chevron-right-black.svg");
  background-position: right 3px center;
  background-size: 12px 12px;
  padding-right: 18px;
  background-repeat: no-repeat;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  margin-left: auto;
  cursor: pointer;
  &:focus, &:active
    border: 1px solid rgba(0, 0, 0, 0.3);;
    outline: none;
</style>
