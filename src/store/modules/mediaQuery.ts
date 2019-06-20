export enum ScreenSize {
  Wide, // >= 1000px
  Middle, // >= 600px
  Small // < 600px
}
interface State {
  size: ScreenSize;
}
export default {
  namespaced: true,
  state: {
    size: ScreenSize.Wide
  },
  getters: {
    isWide: (state: State) => state.size === ScreenSize.Wide,
    isMiddle: (state: State) => state.size === ScreenSize.Middle,
    isSmall: (state: State) => state.size === ScreenSize.Small
  },
  mutations: {
    setSize(state: State, payload: ScreenSize) {
      state.size = payload;
    }
  }
};
