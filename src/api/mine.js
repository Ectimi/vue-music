import axios from '../lib/axios-init'

const USERPLAYLIST_URL = '/user/playlist'

//获取新歌推荐
function api_getUserPlaylist(params) {
    return axios.get(USERPLAYLIST_URL, { params })
}

export {
    api_getUserPlaylist
}