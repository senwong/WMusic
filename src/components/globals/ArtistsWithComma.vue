<script>
import { arrayJoin } from '@/utilitys';

export default {
  functional: true,
  render(h, { props: { artists, aTagClass, commaClass } }) {
    return arrayJoin(artists, 'comma').map(ar => {
      return ar == 'comma'
        ? <span class={commaClass}>, </span>
        : <a class={aTagClass} href={ '/artist/' + ar.id}>{ar.name}</a>
    });
  }  
}
</script>
