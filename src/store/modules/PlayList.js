import { getPlaylistDetail, getAlbumDetail } from "@/service/Service";

const state = {
  currentSongId: null,
  tracks: [],
};
const getters = {
  trackCount: state => state.tracks.length,
  trackIds: state => state.tracks.map(o => o.id),
};
const mutations = {
  setTracks(state, tracks) {
    state.tracks = tracks;
  },
  setCurrentSongId(state, id) {
    state.currentSongId = id;
  },
  // 下一首播放
  /*
    if track exists in state.tracks
      if track.id equal to currentSongId
        return
      else
        currentSongIdx = state.tracks.findIndex(t => t.id == state.currentSongId);
        const trackIdx = state.tracks.findIndex(t => t.id == track.id);
        if currentSongIdx is last
          const newTracks = state.tracks.slice().splice(trackIdx, 1).push(track);
        else
          const newTracks = state.tracks.slice();
          const t = newTracks[trackIdx];
          newTracks[trackIdx] = newTracks[currentSongIdx+1];
          newTracks[currentSongIdx+1] = t;
    else
        currentSongIdx = state.tracks.findIndex(t => t.id == state.currentSongId);
        const front = state.tracks.slice(0, currentSongIdx + 1);
        const rear = state.tracks.slice(currentSongIdx + 1);
        front.push(track);
        state.tracks = front.concat(rear);
  */
  addToNext(state, track) {
    if (state.tracks.length == 0) {
      state.tracks = [track];
      state.currentSongId = track.id;
      return;
    }
    const trackIdx = state.tracks.findIndex(t => t.id == track.id);
    const currentSongIdx = state.tracks.findIndex(t => t.id === state.currentSongId);
    if (trackIdx > -1) {
      if (state.currentSongId != track.id) {
        if (currentSongIdx == state.tracks.length - 1) {
          const newTracks = state.tracks.slice().splice(trackIdx, 1).push(track);
          state.tracks = newTracks;
          return;
        } else {
          const newTracks = state.tracks.slice();
          const t = newTracks[trackIdx];
          newTracks[trackIdx] = newTracks[currentSongIdx+1];
          newTracks[currentSongIdx+1] = t;
          state.tracks = newTracks;
          return;
        }
      }
    } else {
      const front = state.tracks.slice(0, currentSongIdx + 1);
      const rear = state.tracks.slice(currentSongIdx + 1);
      front.push(track);
      state.tracks = front.concat(rear);
    }
  },
}

// const actions = {
//   set({ state, commit }, playlistId, selectedSongId) {
//     if (selectedSongId) 
//     getPlaylistDetail(playlistId).then(
//       res => {
//         commit('set', res.data.playlist.tracks);
//         commit('setCurrentSongId', typeof selectedSongId === 'undefined'
//           ? res.data.playlist.trackIds[0].id
//           : selectedSongId);
//       },
//       error => alert('getPlaylistDetail error ' + error)
//     );
//   },
// }

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
