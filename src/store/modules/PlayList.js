import { PLAYMODES } from "@/config"
import Song from "./Song"

class PlayList {
  constructor(songs, id, currentSongId) {
    this.songs = songs
    this.id = id
    this.playMode = PLAYMODES.loop
    if (currentSongId !== undefined) {
      this.currentSongId = currentSongId
    } else {
      this.currentSongId = songs.length > 0 ? songs[0].id : undefined  
    }
    // this.play()
  }
  play(songId) {
    if (songId !== undefined) this.setCurrentSong(songId)
    let currentSong = this.getCurrentSong()
    if (!currentSong) return
    currentSong.play()
    currentSong.onended(this.next.bind(this))
  }
  pause() {
    this.getCurrentSong().pause()
  }
  next() {
    let index = this.songs.findIndex(s => s.id === this.currentSongId)
    this.songs[index].end()
    if (this.playMode === PLAYMODES.loop) {
      index = index < this.songs.length - 1 ? index + 1 : 0
    }
    if (this.playMode === PLAYMODES.shuffle) {
      index = Math.floor(Math.random() * this.songs.length)
    }
    console.log("index: ", index)
    this.currentSongId = this.songs[index].id
    this.play()
  }
  prev() {
    let index = this.songs.findIndex(s => s.id === this.currentSongId)
    this.songs[index].end()
    if (this.playMode === PLAYMODES.loop) {
      index = index > 0 ? index - 1 : this.songs.length - 1
    }
    if (this.playMode === PLAYMODES.shuffle) {
      index = Math.floor(Math.random() * this.songs.length)
    }
    this.currentSongId = this.songs[index].id
    this.play()
  }
  empty() {
    this.songs = []
    this.currentSongId = undefined
  }
  addSong(song) {
    this.songs.push(song)
  }
  changeVolume(volume) {
    this.songs.find(s => s.id === this.currentSongId).changeVolume(volume)
  }
  changePlayMode(newMode) {
    if(!Object.values(PLAYMODES).contains(newMode)) console.warn("new mode" + newMode + "isn't one of formal modes "+Object.values(PLAYMODES))
  }
  getCurrentSong() {
    if(this.songs.length < 1) return false
    if (this.currentSongId == undefined) this.currentSongId = this.songs[0].id
    return this.songs.find(s => s.id === this.currentSongId)
  }
  setCurrentSong(songId) {
    if (songId == this.currentSongId || !this.songs.map(s => s.id).includes(songId)) return
    let currentSong = this.getCurrentSong()
    if (currentSong && currentSong.isPlaying) {
      currentSong.end()
    }
    this.currentSongId = songId
  }
  remove(songId) {
    const index = this.songs.findIndex(s => s.id === songId)
    if (songId == this.currentSongId) {
      if (this.songs.length == 1) {
        this.currentSongId = undefined
      } else if (index == this.songs.length - 1) {
        this.currentSongId = 0
      } else {
        this.currentSongId = this.songs[index + 1].id
      }
    }
    this.songs.splice(index, 1)
  }
  getSong(songId) {
    return this.songs.find(s => s.id === songId)
  }
  removeSong(songId) {
    const index = this.songs.findIndex(e => e.id == songId)
    return this.songs.splice(index, 1)
  }
  addToCurrentNext(song) {
    const index = this.songs.findIndex(e => e.id == this.currentSongId)
    this.songs.splice(index + 1, 0, song)
    return this
  }
  contains(songId) {
    return this.songs.findIndex(e => e.id == songId) > -1
  }
  getFirstSongId() {
    return this.songs[0].id
  }
  push(song) {
    if (song instanceof Song) {
      this.songs.push(song)
      return
    }
    console.warn("添加的歌曲必须是Song实例： ", song)
  }
}
export default PlayList