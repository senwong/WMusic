import { PLAYMODES } from "@/config"
import { getPlaylistDetail, getAlbumDetail } from "@/service/Service"

const state = {
  songs: [],
  id: null,
  playMode: PLAYMODES.loop,
  currentSong: null,
}
const getters = {
  currentSongId: (state) => {
    return state.currentSong.id
  }
}
const actions = {
  setNewPlaylist ({ state, commit }, { id }) {
    if (state.id == id) return
    getPlaylistDetail(id).then(res => {
      const tracks = res.data.playlist.tracks
      const songs = tracks.map(track => {
        const artists = track.ar.map(ar => { return {id: ar.id, name: ar.name} })
        return {
          id: track.id,
          name: track.name,
          album: {
            id: track.al.id,
            name: track.al.name,
            picUrl: track.al.picUrl,
          },
          artists: artists,
          duration: track.dt
        }
      })
      commit("setSongs", { songs, id })
    })
  },
  setNewAlbum ({ state, commit}, { id }) {
    if (state.id == id) return
    getAlbumDetail(id).then(res => {
      const tracks = res.data.songs
      const songs = tracks.map(track => {
        const artists = track.ar.map(ar => { return {id: ar.id, name: ar.name} })
        return {
          id: track.id,
          name: track.name,
          album: {
            id: track.al.id,
            name: track.al.name,
            picUrl: track.al.picUrl,
          },
          artists: artists,
          duration: track.dt
        }
      })
      commit("setSongs", { songs, id })
    })
  },
}
const mutations = {
  changePlayMode (state,{ mode }) {
    if(!Object.values(PLAYMODES).contains(mode)) console.warn("new mode" + mode + "isn't one of formal modes "+Object.values(PLAYMODES))
    state.playMode = mode
  },
  empty (state) {
    state.songs = []
    state.id = null
    state.currentSong = null
  },
  addSong (state, { song }) {
    state.songs.push(song)
  },
  changeVolume (state, { value }) {
    state.currentSong.volume = value
  },
  setSongs (state, { songs, id }) {
    state.songs = songs
    state.id = id
    state.currentSong = null
  },
  setCurrentSong ({ state, rootState}, { id }) {
    state.currentSong = state.songs.find(s => s.id == id)
    rootState.song
  }
}

export default {
  nameSpace: true,
  state,
  getters,
  actions,
  mutations,
}
