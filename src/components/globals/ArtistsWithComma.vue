<script>
// import { arrayJoin } from '@/utilitys';
// import { Artist } from '@/types';
// import { Prop, Component } from 'vue-property-decorator';
// import Vue, { VNode, CreateElement } from 'vue'

// @Component
// export default class ArtistWithComma extends Vue {
//   functional: boolean = true
//   @Prop() readonly artists!: Artist[];
//   @Prop(String) readonly commaClass?: string;
//   @Prop(String) readonly aTagClass?: string;

//   render(h: CreateElement): VNode {
//     const aTagClass: {[key: string]: boolean} = {};
//     if (this.aTagClass) {
//       aTagClass[this.aTagClass] = true;
//     }

//     const children = arrayJoin(this.artists, 'comma').map(ar => {
//       return ar == 'comma'
//         ? h('span', {class: this.commaClass}, ',')
//         : h('router-link',
//           {
//             class: aTagClass,
//             props: {
//               to: '/artist/' + ar.id
//             }
//           },
//           ar.name
//         );
//     })
//     return h('template', {}, children);
//     // return children;
//   }
// }
import { arrayJoin } from "@/utilitys";

export default {
  functional: true,
  render(
    h,
    {
      props: { artists, aTagClass, commaClass }
    }
  ) {
    return arrayJoin(artists, "comma").map(ar => {
      return ar == "comma" ? (
        <span class={commaClass}>, </span>
      ) : (
        <RouterLink class={aTagClass} to={"/artist/" + ar.id}>
          {ar.name}
        </RouterLink>
      );
    });
  }
};
</script>
