import { arrayJoin } from "@/utilitys";
import { VNode, CreateElement } from "vue";
import { Artist } from "@/types";
interface Props {
  artists: Artist[];
  aTagClass: string;
  commaClass: string;
}

export default {
  functional: true,
  render(h: CreateElement, context: { props: Props }): VNode[] {
    const artists: Artist[] = context.props.artists;
    const aTagClass: string = context.props.aTagClass;
    const commaClass: string = context.props.commaClass;
    return arrayJoin(artists, "comma").map(ar => {
      return ar == "comma"
        ? h("span", { class: commaClass, domProps: { innerHTML: ",&nbsp;" } })
        : h("router-link", {
            class: aTagClass,
            attrs: { to: "/artist/" + ar.id },
            domProps: { innerText: ar.name }
          });
    });
  }
};
