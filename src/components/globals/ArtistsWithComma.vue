<script>
import { arrayJoin } from '@/utilitys';

export default {
  functional: true,
  render(h, { props: { artists, aTagClass, commaClass } }) {
    return arrayJoin(artists, 'comma').map(ar => {
      return ar == 'comma'
        ? <span class={commaClass}>, </span>
        : <RouterLink class={aTagClass} to={ '/artist/' + ar.id}>{ar.name}</RouterLink>
    });
  }  
}
</script>
