<template>
  <div class="main-wrapper">
    <div class="container">
      <h1>最新MV</h1>
      <div class="card-container">
        <card-item
          v-for="mv in newMVList"
          :key="mv.id"
          :card="mv"
          cardType="mvplay"
        >
        </card-item>
      </div>
      <div class="title">
        <span class="text-h1">MV排行榜</span>
        <span class="text-gray">{{formatDate(updateTime)}}更新</span>
        <router-link to="/mv/rank" class="button-bg-right">更多</router-link>
      </div>
      <div class="rank-container">
        <rank-item
          v-for="(media, i) in MVrankList"
          :key="media.id"
          :rank-item="media"
          :index="i">
        </rank-item>
      </div>
    </div>
  </div>
</template>
<script>
  import { getNewMV, getPersonalizedMV, getMVrank } from "@/service"
  import CardItem from "./CardItem"
  import RankItem from "./RankItem"
  import { formatDate } from "@/utilitys"
  export default {
    name: "MV",
    components: { CardItem, RankItem },
    data() {
      return {
        newMVList: [],
        MVrankList: [],
        updateTime: 0,
        formatDate: formatDate,
      }
    },
    created() {
      getNewMV().then(res => {
        if(res.data.code == 200) {
          this.newMVList = res.data.data
          this.newMVList.forEach(mv => {
            mv.cover = mv.cover.replace(/http:\/\//g, "https://")
          })
        } else {
          alert("获取最新MV数据错误" + res.data)
        }
      })
      getMVrank().then(res => {
        if(res.data.code == 200) {
          this.updateTime = res.data.updateTime
          this.MVrankList = res.data.data
          this.MVrankList.forEach(mv => {
            mv.cover = mv.cover.replace(/http:\/\//g, "https://")
          })
        } else {
          alert("获取MV排行榜数据错误" + res.data)
        }
      })
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
  color: #000;
  opacity: 0.3;
.text-h1
  font-size: 28px;
  padding-right: 10px; 
.card-container
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;


.rank-container
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-auto-rows: 150px;
  gap: 2em;
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

