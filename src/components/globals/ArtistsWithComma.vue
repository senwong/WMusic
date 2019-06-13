<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { arrayJoin } from "@/utilitys";
import { VNode, CreateElement } from "vue";
import { Artist } from "@/types";
interface Props {
  artists: Artist[];
  aTagClass: string;
  commaClass: string;
}

@Component
export default class ArtistsWithComma extends Vue {
  @Prop() artists!: Artist[];
  @Prop({ type: Boolean, default: false }) secondary!: boolean;
  @Prop({ type: Boolean, default: false }) small!: boolean;
  renderComma(h: CreateElement) {
    return h(
      "span",
      {
        staticClass: "artist-with-comma__comma",
        class: {
          "artist-with-comma__comma--secondary": this.secondary,
          "artist-with-comma__comma--small": this.small
        }
      },
      [", "]
    );
  }
  renderArtist(h: CreateElement, ar: Artist) {
    return h(
      "router-link",
      {
        staticClass: "artist-with-comma__artist",
        class: {
          "artist-with-comma__artist--secondary": this.secondary,
          "artist-with-comma__artist--small": this.small
        },
        attrs: { to: "/artist/" + ar.id }
      },
      [ar.name]
    );
  }
  renderArtists(h: CreateElement): VNode[] {
    return arrayJoin(this.artists, "comma").map(ar => {
      return ar == "comma" ? this.renderComma(h) : this.renderArtist(h, ar);
    });
  }
  render(h: CreateElement): VNode {
    if (this.artists.length < 1) {
      return h();
    } else if (this.artists.length === 1) {
      return h(
        "router-link",
        {
          staticClass: "artist-with-comma artist-with-comma__artist",
          class: {
            "artist-with-comma--secondary": this.secondary,
            "artist-with-comma--small": this.small
          },
          attrs: { to: "/artist/" + this.artists[0].id }
        },
        [this.artists[0].name]
      );
    } else {
      return h(
        "span",
        {
          staticClass: "artist-with-comma",
          class: {
            "artist-with-comma--secondary": this.secondary,
            "artist-with-comma--small": this.small
          }
        },
        [this.renderArtists(h)]
      );
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"

.artist-with-comma
  &--secondary
    @include themify($themes)
      color: themed("secondary-color")
  &--small
    font-size: 0.875em
  &__artist
    font-size: inherit
    color: inherit
    &:hover
      color: $primary-color
</style>
