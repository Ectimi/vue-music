import axios from '../lib/axios-init'

const CATEGORY_URL = '/playlist/catlist'
const HOTCATEGORY_URL= '/playlist/hot'
const PLAYLIST_URL = '/top/playlist'

//获取所有分类
function api_getCategory() {
    return axios.get(CATEGORY_URL)
}

//获取热门分类
function api_getHotCategory() {
    return axios.get(HOTCATEGORY_URL)
}

//根据分类名获取歌单
/**
 * 
 * params:{
 *      order:new/hot 最新或最热，默认hot
 *      limit:number  返回条数
 *      cat:tag     标签分类
 * }
 */
function api_getPlayListByCategory(params) {
    return axios.get(PLAYLIST_URL ,{params})
}

export {
    api_getCategory,
    api_getHotCategory,
    api_getPlayListByCategory
}