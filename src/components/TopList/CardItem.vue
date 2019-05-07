<template>
  <div class="list-item" v-if="content">
    <CardImage
      :play="{ onClick: () => play() }"
      :href="'/playlist/' + content.id"
      :src="content.picUrl | convert2Https"
      :alt="content.name"
      ratio="1:1"
      radius
    />
    <router-link :to="'/playlist/' + content.id" class="list__name">
      {{ content.name }}
    </router-link>
  </div>
</template>
<script lang="ts">
import CardImage from "@/components/globals/CardImage.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { getTopList } from "@/service";

@Component({
  components: { CardImage }
})
export default class CardItem extends Vue {
  @Prop() typeId!: number;

  content: {
    id: number;
    picUrl: string;
    name: string;
  } | null = null;

  created() {
    getTopList(this.typeId).then(res => {
      const p = res.data.playlist;
      this.content = {
        id: p.id,
        picUrl: p.coverImgUrl,
        name: p.name
      };
    });
  }

  play() {
    // TODO
  }
}
</script>
<style lang="sass" scoped>
.list-item
  display: flex
  flex-direction: column
  position: relative

.list-cover
  margin-bottom: 1em

.list__name
  margin: 8px 0
  text-decoration: none
  color: inherit
  font-weight: bolder
  font-size: 14px
  &:hover
    text-decoration: underline
</style>
