import { Theme } from '@/types';
type State = {
  value: Theme,
}
export default {
  namespaced: true,
  state: {
    value: Theme.Light,
  },
  mutations: {
    toggle(state: State) {
      state.value = state.value === Theme.Dark ? Theme.Light : Theme.Dark;
    }
  },
}
