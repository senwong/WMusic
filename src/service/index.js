import Api from "./Api"
/**
 * 获取轮播图图片
 */
function getBanner() {
  return Api().get("banner")
}
/**
 * 获取歌曲的播放地址
 * @param {Number} songId 歌曲ID
 */
function getSongURL(songId) {
  return Api().get("song/url?id=" + songId)
}
/**
 * 获取歌曲信息
 * @param {Number} songId 歌曲ID
 */
function getSongDetail(songId) {
  return Api().get("/song/detail?ids=" + songId)
}
/**
 * 获取推荐歌单
 */
function getRecommendSongList() {
  return Api().get("/personalized")
}
/**
 * 获取歌单详情
 * @param {Number} playlistId 歌单ID
 */
function getPlaylistDetail(playlistId) {
  return Api().get("/playlist/detail?id=" + playlistId)
}
/**
 * 获取歌手描述
 * @param {Number} artistId 歌手ID
 */
function getArtistDesc(artistId) {
  return Api().get("/artist/desc?id=" + artistId)
}
/**
 * 获取歌手信息
 * @param {Number} artistId 歌手ID
 */
function getArtistInfo(artistId) {
  return Api().get("/artists?id=" + artistId)
}
/**
 * 获取歌手的专辑
 * @param {Number} artistId 歌手ID
 */
function getArtistAlbums(artistId) {
  return Api().get("/artist/album?id=" + artistId)
}
/**
 * 获取专辑详情
 * @param {Number} albumId 专辑ID
 */
function getAlbumDetail(albumId) {
  return Api().get("/album?id=" + albumId)
}
/**
 * 获取歌曲评论
 * @param {Number} songId 歌曲ID
 * @param {Number} offset 偏移数量
 */
function getSongComment(songId, offset) {
  return Api().get("/comment/music?id=" + songId + "&limit=20&offset=" + offset)
}
/**
 * 获取歌单分类
 */
function getPlayListCatlist() {
  return Api().get("/playlist/catlist")
}
/**
 * 获取歌单（网友精选碟）
 * @param {String} cat 歌单风格
 * @param {String} order 歌单类型：hot|new
 * @param {Number} offset 偏移数量
 */
function getPlayList(cat = "全部", order = "hot", offset = 0) {
  return Api().get("/top/playlist?limit=20&cat=" + cat + "&order=" + order +"&offset=" + offset)
}
/**
 * 获取排行榜
 * @param {Number} idx 排行榜类型
 */
function getTopList(idx) {
  return Api().get("/top/list?idx="+idx)
}
/**
 * 获取最新MV
 */
function getNewMV() {
  return Api().get("/mv/first?limit=6")
}
/**
 * 获取推荐MV
 */
function getPersonalizedMV() {
  return Api().get("/personalized/mv?limit=6")
}
/**
 * 获取MV数据
 * @param {Number} id MV ID
 */
function getMvData(id) {
  return Api().get("/mv/detail/?mvid=" + id)
}
/**
 * 获取MV评论
 * @param {Number} id MV ID
 */
function getMVComments(id, offset) {
  return Api().get("/comment/mv?id=" + id + "&limit=20&offset=" + offset)
}
/**
 * 获取相似MV
 * @param {Number} id MV ID
 */
function getSimilarMV(id) {
  return Api().get("/simi/mv?mvid=" + id)
}
/**
 * 获取MV排行榜
 * @param {Number} limit 偏移数量
 */
function getMVrank(limit=10) {
  return Api().get("top/mv?limit="+limit)
}
/**
 * 获取歌词
 * @param {Number} id 歌曲ID
 */
function getLyrics(id) {
  return Api().get("/lyric?id=" + id)
}
/**
 * 搜索
 * @param {String} keywords 关键词
 * @param {Number} type 搜索类型
 * @param {Number} limit 返回数量
 * @param {Number} offset 偏移数量
 */
function search(keywords, type=1, offset=0, limit=30) {
  return Api().get( `/search?keywords=${keywords}&type=${type}&limit=${limit}&offset=${offset}`)
}
/**
 * 搜索建议
 * @param {String} keywords 关键字
 */
function searchSuggest(keywords) {
  return Api().get("/search/suggest?keywords=" + keywords)
}
/**
 * 获取相似歌曲
 * @param {Number} songId 
 */
function getSimiSongs(songId) {
  return Api().get("/simi/song?id=" + songId)
}
/**
 * 获取用户详情
 * @param {Number} uid 用户id
 */
function getUserDetail(uid) {
  return Api().get("/user/detail?uid=" + uid);
}
/**
  * 获取用户的歌单
  * @param {Number} uid 用户id
 */
function getUserPlaylist(uid, offset=0) {
  return Api().get("/user/playlist?uid=" + uid + '&offset=' + offset);
}
/**
 * 邮箱登录
 * @param {String} email 邮箱地址
 * @param {String} password 密码
 */
function loginEmail(email, password) {
  return Api().get(`/login?email=${email}&password=${password}`, {withCredentials: true});
}
/**
 * 手机登录
 * @param {Number} phone 手机号码
 * @param {String} password 密码
 * @param {Number} countrycode 国家码
 */
function loginPhone(phone, password, countrycode) {
  let url = `/login/cellphone?phone=${phone}&password=${password}`;
  url += typeof countrycode == 'undefined' ? '' : `&countrycode=${countrycode}`;
  return Api().get(url, {withCredentials: true});
}
function logout() {
  return Api().get('/logout');
}
/**
 * 登陆后调用此接口 , 传入用户 id, 可获取用户播放记录
 * @param {Number} uid 用户 id
 * @param {Number} type type=1 时只返回 weekData, type=0 时返回 allData
 */
function getRecord(uid, type) {
  let url = `/user/record?uid=${uid}`
  url += typeof type == 'undefined' ? '' : `&type=${type}`;
  return Api().get(url, {withCredentials: true});
}
/**
 * 调用此接口 , 传入用户 id, 可获取已喜欢音乐id列表(id数组)
 * @param {Number} uid 用户 id
 */
function getLikelist(uid) {
  return Api().get(`/likelist?uid=${uid}`, {withCredentials: true});
}
/**
 * 登陆后调用此接口 , 传入用户 id, 可以获取用户关注列表
 * @param {Number} uid 用户 id
 * @param {Number} limit 返回数量 , 默认为 30
 * @param {Number} offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
function getUserFollows(uid, offset, limit) {
  return Api().get(`/user/follows?uid=${uid}&offset=${offset}&limit=${limit}`);
}
/**
 * 登陆后调用此接口 , 传入用户 id, 可以获取用户粉丝列表
 * @param {Number} uid 用户 id
 * @param {Number} limit 返回数量 , 默认为 30
 * @param {Number} offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
function getUserFolloweds(uid, offset, limit) {
  return Api().get(`/user/followeds?uid=${uid}&offset=${offset}&limit=${limit}`);
}
export {
  getBanner,
  getSongURL,
  getSongDetail,
  getRecommendSongList,
  getPlaylistDetail,
  getArtistDesc,
  getArtistInfo,
  getArtistAlbums,
  getAlbumDetail,
  getSongComment,
  getPlayListCatlist,
  getPlayList,
  getTopList,
  getNewMV,
  getPersonalizedMV,
  getMvData,
  getMVComments,
  getSimilarMV,
  getMVrank,
  getLyrics,
  search,
  searchSuggest,
  getSimiSongs,
  getUserDetail,
  getUserPlaylist,
  loginEmail,
  loginPhone,
  logout,
  getRecord,
  getLikelist,
  getUserFollows,
  getUserFolloweds,
}