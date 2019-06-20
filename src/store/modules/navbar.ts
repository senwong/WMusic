interface State {
  visible: boolean;
}

export default {
  namespaced: true,
  state: {
    visible: false
  },
  mutations: {
    setVisibility(state: State, playload: boolean) {
      state.visible = playload;
    }
  }
};
