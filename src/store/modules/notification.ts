interface State {
  msg: string;
  timestamp: number;
  isVisible: boolean;
}
export default {
  namespaced: true,
  state: {
    msg: "",
    timestamp: 0,
    isVisible: false
  },
  mutations: {
    setMsg(state: State, msg: string) {
      state.msg = msg;
      state.timestamp = Date.now();
    },
    setVisibility(state: State, v: boolean) {
      state.isVisible = v;
    }
  }
};
