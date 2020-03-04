import axios from '../lib/axios-init'

const BANNER_URL = '/banner'
const PLAYLIST_RECOMMEND_URL = '/personalized'
const NEWSONG_URL = '/personalized/newsong'
const NEWALBUM_URL = '/top/album'


//获取轮播图
function api_getBanner() {
    return axios.get(BANNER_URL)
}

//获取推荐歌单
function api_getPlaylistRecommend(params) {
    return axios.get(PLAYLIST_RECOMMEND_URL, { params })
}

//获取新歌推荐
function api_getNewSong(params) {
    return axios.get(NEWSONG_URL, { params })
}

//获取新碟推荐
function api_getNewAlbum(params) {
    return axios.get(NEWALBUM_URL, { params })
}

export {
    api_getBanner,
    api_getPlaylistRecommend,
    api_getNewSong,
    api_getNewAlbum
}