import { getUserDetail } from '@/service';

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
  actions: {
    refresh({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.profile && state.profile.userId) {
          getUserDetail(state.profile.userId).then(
            res => {
              const profile = res.data.profile;
              commit('setCurrentUser', profile);
              resolve();
            },
            error => reject(error)
          );
        } else {
          reject();
        }
      })
    }
  }
}
