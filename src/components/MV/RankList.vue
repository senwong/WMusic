<template>
  <div>
    <div class="title">
      <span class="text-h1">MV排行榜</span>
      <span class="text-gray">{{formatDate(updateTime)}}更新</span>
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
</template>
<script>
  import { getMVrank } from "@/service/Service"
  import { formatDate } from "@/utilitys"
  import RankItem from "./RankItem"
  export default {
    name: "MV",
    components: { RankItem },
    data() {
      return {
        MVrankList: [],
        updateTime: "",
        formatDate: formatDate,
      }
    },
    created() {
      const limit=50
      getMVrank(limit).then(res => {
        if(res.data.code == 200) {
          console.log(res.data)
          this.updateTime = res.data.updateTime
          this.MVrankList = res.data.data
          this.MVrankList.forEach(mv => {
            mv.cover = mv.cover.replace(/http:\/\//g, "https://")
          })
        } else {
          console.warn("获取MV排行榜数据错误" + res.data)
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
</style>