import { getUserDetail } from "@/service/index";

interface CurrentUserState {
  userId: number | undefined;
}

export default {
  namespaced: true,
  state: {
    userId: undefined
  },
  mutations: {
    setCurrentUserId(state: CurrentUserState, id: number) {
      state.userId = id;
    }
  }
};
