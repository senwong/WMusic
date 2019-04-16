import Vue from "vue"
import Vuex from "vuex"
import Artist from "./modules/Artist"
import Song from "./modules/Song"
import PlayList from "./modules/PlayList"
import { getSongDetail, getSongURL, getPlaylistDetail, } from "@/service/Service"
const defaultplayList = new PlayList([new Song({
  id: 326703,
  name: "艳火",
  imgUrl: "http://p1.music.126.net/klOSGBRQhevtM6c9RXrM1A==/18808245906527670.jpg",
  artists: [new Artist(10557, "张悬")],
  duration: 221866,
})])

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    isLogin: false,
    playList: defaultplayList,
    isScrollBottom: false,
    rightPlaylistVisible: false,
  },
  mutations: {
    newPlayList(state, playList) {
      state.playList = playList
    },
    changePlayMode(state, newMode) {
      state.playList.playMode = newMode
    },
    changeScroll(state, isScrollBottom) {
      state.isScrollBottom = isScrollBottom
    },
    toggleRightPlaylist(state) {
      console.log('mutations toggleRightPlaylist');
      state.rightPlaylistVisible = !state.rightPlaylistVisible;
    },
  },
  actions: {
    // 播放一个列表的歌曲，可以是歌单或者专辑
    newPlayList(context, {type, id, songId, isPlay}) {
      if(type == "PLAYLIST") {
        const isSameSong = context.state.playList.currentSongId == songId;
        const isSamePlaylist = context.state.playList.id == id;
        if (isSameSong && isSamePlaylist) return;
        if (isSamePlaylist) {
          console.log("song id ", songId)
          context.state.playList.play(songId)
          return;
        }
        getPlaylistDetail(id).then(res => {
          const tracks = res.data.playlist.tracks
          const songs = tracks.map(track => {
            const artists = track.ar.map(ar => new Artist(ar.id, ar.name));
            return new Song({
              id: track.id,
              name: track.name,
              imgUrl: track.al.picUrl,
              artists,
              duration: track.dt,
            });
          })
          context.commit("newPlayList", new PlayList(songs, id, songId))
          if (isPlay) context.state.playList.play()
        }).catch(e => {
          console.warn(e)
        })
      }
    },
    // 播放一首单曲，生成的playlist只有这一首歌
    newSingleSong(context, songId) {
      Promise.all([getSongDetail(songId) , getSongURL(songId)]).then(([resDetail, resSongUrl]) => {
        const songDetail = resDetail.data.songs[0]
        const songUrl = resSongUrl.data.data[0].url.replace(/http:\/\//g, "https://")
        const artists = songDetail.ar.map(ar => new Artist(ar.id, ar.name))
        const song = new Song({
          id: songDetail.id,
          name: songDetail.name,
          imgUrl: songDetail.al.picUrl,
          songUrl: songUrl,
          artists: artists,
          duration: songDetail.dt
        })
        // songDetail.id, songDetail.name, songDetail.al.picUrl, songUrl, artists, songDetail.dt
        const playList = new PlayList([song])
        playList.play()
        context.commit("newPlayList", playList)
      })
    },
    // 加入到下一首播放
    addToNext(context,songId) {
      // 正在播放，返回
      if(songId == context.state.playList.currentSongId) return
      // 如果要加入的song在list中， 把它调到currentSong的后面
      if (context.state.playList.contains(songId)) {
        const song = context.state.playList.removeSong(songId)
        context.commit("newPlayList", context.state.playList.addToCurrentNext(song))
        return
      }
      // 如果要加入的song不在list中，fetch它的信息，初始化后加入到currentSong的后面
      getSongDetail(songId).then(res => {
        console.log(res)
        if(res.status == 200) {
          const songDetail = res.data.songs[0]
          const artists = songDetail.ar.map(ar => new Artist(ar.id, ar.name))
          const newSong = new Song({
            id: songId,
            name: songDetail.name,
            imgUrl: songDetail.al.picUrl,
            artists,
            duration: songDetail.dt,
          });
          context.commit("newPlayList", context.state.playList.addToCurrentNext(newSong))
          return
        }
        console.warn("获取歌曲信息错误： "+res)
      })
    },
    playAllList(context, {type, id}) {
      if(type == "PLAYLIST") {
        
        if (context.state.playList.id == id) {
          context.state.playList.play(context.state.playList.getFirstSongId())
          return
        }
        getPlaylistDetail(id).then(res => {
          const tracks = res.data.playlist.tracks
          const songs = tracks.map(track => {
            const artists = track.ar.map(ar => new Artist(ar.id, ar.name))
            return new Song({
              id: track.id,
              name: track.name,
              imgUrl: track.al.picUrl,
              artists,
              duration: track.dt,
            });
          })
          context.commit("newPlayList", new PlayList(songs, id))
          context.state.playList.play()
        }).catch(e => {
          console.warn(e)
        })

      }
    },
    addListToList(context, {type, id}) {
      if(type == "PLAYLIST") {
        /*
        如果id等于当前id，返回
        获取list信息，遍历list中的歌曲，如果不在当前list中，就push到list后面
        */
        if (id == context.state.playList.id) return
        getPlaylistDetail(id).then(res => {
          if(res.data.code !== 200) {
            console.warn("获取歌单错误： "+res.data)
            return
          }
          res.data.playlist.tracks.forEach(track => {
            if (!context.state.playList.contains(track.id)) {
              const artists = track.ar.map(ar => new Artist(ar.id, ar.name))
              context.state.playList.push(new Song({
                id: track.id,
                name: track.name,
                imgUrl: track.al.picUrl,
                artists,
                duration: track.dt,
              }));
            }
          })
        })
      }
    }
  }
})