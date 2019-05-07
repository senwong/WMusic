interface State {
  paused: boolean;
  audio: HTMLAudioElement | null;
}

export default {
  namespaced: true,
  state: {
    paused: true,
    audio: null
  },
  mutations: {
    setAudio(state: State, audio: HTMLAudioElement) {
      state.audio = audio;
    },
    setPaused(state: State, paused: boolean) {
      state.paused = paused;
    },
    togglePlay(state: State) {
      if (state.audio) {
        if (state.paused) {
          state.audio.play();
        } else {
          state.audio.pause();
        }
      }
    }
  }
};
