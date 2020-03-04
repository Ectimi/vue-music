import axios from '../lib/axios-init'

const CATEGORY = '/playlist/catlist'
const PLAYLIST = '/playlist/'

//获取所有分类
function api_getCategory() {
    return axios.get(CATEGORY)
}

//根据分类名获取歌单
function api_getPlayListByCategory(category) {
    return axios.get(PLAYLIST + '/' + category)
}

export {
    api_getCategory,
    api_getPlayListByCategory
}