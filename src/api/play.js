import axios from '../lib/axios-init'
 
//歌曲详情 （标题、歌手等）
const DETAIL_URL = '/song/detail'

//歌曲链接
const SRC_URL = '/song/url'

//歌词
const LYRIC_URL = '/lyric'

function api_getSongDetail(params) {
    return axios.get(DETAIL_URL, { params })
}

function api_getSongSrc(params) {
    return axios.get(SRC_URL, { params })
}

function api_getSongLyric(params){
    return axios.get(LYRIC_URL,{params})
}

export {
    api_getSongDetail,
    api_getSongSrc,
    api_getSongLyric
}