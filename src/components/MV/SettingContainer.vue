<template>
<div class="settings-container">
  <ul class="list level-1">
    <li class="list-item">
      <div class="list-item-label">
        画质
      </div>
      <div class="list-item-content">
        <span class="select-result">{{curQuality}}</span>
      </div>
    </li>
  </ul>
  <div class="panel hide">
    <div class="list-panel-header">
      <button class="as-btn list-panel-title">
          返回
      </button>
    </div>
    <hr>
    <ul class="list">
      <li class="list-item"
        role="list-item-radio"
        v-for="(quality, i) in qualitys"
        :key="i"
        :data-br="quality"
        :aria-checked="quality == curQuality"
        @click="setQuality(quality)">
        <span class="list-item-label">
          {{quality + 'p'}}
        </span>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
export default {
  name: "SettingContainer",
  props: ["qualitys"],
  data() {
    return {
      currentQuality: "",
    }
  },
  mounted() {
    this.level1 = this.$el.querySelector(".level-1");
    this.level1Items = this.level1.querySelectorAll(".list-item");
    this.selectResult = this.level1.querySelector(".select-result");
    this.level2 = this.$el.querySelector(".panel");
    this.level2BackBtn = this.level2.querySelector(".list-panel-header");
    // register events
    this.level1Items.forEach(item => {
      item.addEventListener("click", this.level1ToLevel2);
    });
    this.level2BackBtn.addEventListener("click", this.level2ToLevel1);
  },
  methods: {
    level1ToLevel2() {
      this.level1.classList.add("hide");
      this.level2.classList.remove("hide");
    },
    level2ToLevel1() {
      this.level1.classList.remove("hide");
      this.level2.classList.add("hide");
    },
    setQuality(quality) {
      this.currentQuality = quality
      this.level2ToLevel1()
      this.$emit("set-quality", quality)
    }
  },
  computed: {
    curQuality() {
      return this.currentQuality ? this.currentQuality : this.qualitys[this.qualitys.length - 1]
    }
  }
};
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
.as-btn
  border: none;
  background-color: transparent;
  padding: 0;
  color: inherit;
  font-size: 100%;
  cursor: pointer;
  &:focus
    outline: none;
.panel
  font-size: 11px;
.settings-container
  background-color: $black-2;
  color: white;
  font-size: 16px;
  padding: 4px 0;
.list
  padding: 0;
  margin: 0;
  list-style: none;
.list-item
  display: table-row;
  height: 33px;
  cursor: pointer;
  &:hover
    background-color: $mask;
.list-panel-header
  color: #eee;
  font-size: 109%;
  height: 33px;

.list-panel-title
  font-weight: 500;
  padding: 0 10px 0 35px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: left 3px center;
  background-size: 16px 16px;
  background-image: url("../../assets/chevron-left.svg")

.list-item-label
  display: table-cell
  vertical-align: middle;
  padding: 0 15px;
  font-size: 118%;
.list-item-content
  display: table-cell;
  vertical-align: middle;
  padding-right: 38px;
  background-image: url("../../assets/chevron-right.svg");
  background-repeat: no-repeat;
  background-position: right 9px center;
  background-size: 16px 16px;
.list-item[role=list-item-radio] .list-item-label
  padding-left: 35px;
  padding-right: 20px;
.list-item[role=list-item-radio][aria-checked=true] .list-item-label
  background-image: url("../../assets/checkmark.svg");
  background-repeat: no-repeat;
  background-position: left 10px center;
  background-size: 16px 16px;
.hide
  display: none;
.invisible
  visibility: hidden;

</style>
