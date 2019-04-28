export default {
  namespaced: true,
  state: {
    profile: null,
  },
  mutations: {
    setCurrentUser(state, profile) {
      state.profile = profile;
    },
  },
}
