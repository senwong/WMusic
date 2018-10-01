import {getSongURL, } from "@/service/Service"

const state = {
  id: "",
  name: "",
  artists: [],
  duration: "",
  album: "",
  songUrl: "",
  audioElement: null,
}
const getters = {
  currentTime: (state) => {
    return state.audioElement.currentTime
  },
  isPaused: (state) => {
    return state.audioElement.paused
  }
}
const actions = {
  setSong ({ commit }, {id, name, artists, duration, album}) {
    getSongURL(id).then(res => {
      let songUrl = res.data.data[0].url
      songUrl = songUrl.replace(/http:\/\//g, "https::")
      commit("setSong", {id, name, artists, duration, album, songUrl}) 
    })
  },
}
const mutations = {
  setSong (state, {id, name, artists, duration, album, songUrl}) {
    state.id = id
    state.name = name
    state.artists = artists
    state.duration = duration
    state.album = album
    state.songUrl = songUrl
    state.audioElement = new Audio(state.songUrl)
  },
}

export default {
  nameSpace: true,
  state,
  getters,
  actions,
  mutations,
}