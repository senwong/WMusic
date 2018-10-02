import {getSongURL, } from "@/service/Service"
import {convertToHttps} from "@/utilitys"
class Song {
  /**
   * @param {Number} id
   * @param {String} name
   * @param {String} imgUrl  cover img url of song
   * @param {String} songUrl audio url of song
   * @param {Artist[]} artists artists fo song
   * @param {Number} duration duration of song
   */
  /*
  const options = {
    id: songDetail.id,
    name: songDetail.name,
    imgUrl: songDetail.al.picUrl,
    songUrl: songUrl,
    artists: artists,
    duration: songDetail.dt
  }
  */
  constructor(options) {
    this.id = options.id
    this.name = options.name
    this.imgUrl = options.imgUrl
    this.canPlay = true
    this.artists = options.artists
    this.duration = options.duration
    this.songUrl = options.songUrl
    this.init()
  }
  init() {
    this.imgUrl = this.imgUrl.replace("http", "https")

    this.audio = new Audio()
    this.audio.addEventListener("error", e => {
      console.warn("error new Audio (" + this.songUrl + ")", e.target.error)
    })
    this.isPlaying = false
    this.currentTime = 0
    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime
    })
    this._endCallback = null
    this.songUrl && (this.audio.src = this.songUrl)
    // try {
    //   this.canPlay && (this.audio.src = this.songUrl)
    // } catch(e) {
    //   console.log("catch error new Audio (" + this.songUrl + ")", e.target.error)
    // }
  }
  play() {
    if (this.songUrl == undefined) {
      getSongURL(this.id).then(res => {
        res = convertToHttps(res)
        const songUrl = res.data.data[0].url
        // url为空时跳过到结束
        if (!songUrl) {
          this.audio.dispatchEvent(new Event("ended"))
          return
        }
        this.songUrl = songUrl
        this.audio.src = songUrl
        this._playPromise = this.audio.play()
        this.isPlaying = true
        return
      })
    }

    if (this.isPlaying) return
    this._playPromise = this.audio.play()
    console.log("play song", this.audio.paused)
    this.isPlaying = true
  }
  pause() {
    if (this._playPromise != undefined) {
      this._playPromise.then( () => {
        this.audio.pause()
      })
      .catch(e => {
        console.log("song pause error: ", e)
      })
    } else {
      this.audio.pause()
    }
    this.isPlaying = false
  }
  changeVolume(volume) {
    if(volume < 0 || volume > 100) console.warn("volume "+volume+" is over limit 0~100")
    this.audio && (this.audio.volume = volume / 100)
  }
  onended(cb) {
    if(this._endCallback) return
    this._endCallback = cb
    this.audio.addEventListener("ended", function() {
      this.isPlaying = false
      cb()
    })
  }
  end() {
    this.pause()
    this.audio.currentTime = 0
  }
  changeCurrentTime(time) {
    this.audio.currentTime = time
  }
}
export default Song