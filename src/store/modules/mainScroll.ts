interface State {
  isBottom: boolean;
  scrollTop: number;
}

export default {
  namespaced: true,
  state: {
    isBottom: false,
    scrollTop: 0
  },
  mutations: {
    setIsBottom(state: State, playload: boolean) {
      state.isBottom = playload;
    },
    setScrollTop(state: State, playload: number) {
      state.scrollTop = playload;
    }
  }
};
