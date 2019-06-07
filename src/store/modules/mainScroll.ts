interface State {
  isBottom: boolean;
  maxScrollTop: number;
}

export default {
  namespaced: true,
  state: {
    isBottom: false,
    maxScrollTop: 0
  },
  mutations: {
    setIsBottom(state: State, playload: boolean) {
      state.isBottom = playload;
    },
    setMaxScrollTop(state: State, playload: number) {
      state.maxScrollTop = playload;
    }
  }
};
