import axios from '../lib/axios-init'

const TOPLIST_URL = '/toplist';
const LISTDETAIL_URL = '/toplist/detail'

//获取所有榜单
function api_getTopList(){
    return axios.get(TOPLIST_URL)
}

//获取榜单摘要
function api_getListDetail(){
    return axios.get(LISTDETAIL_URL)
}

export {
    api_getTopList,
    api_getListDetail
}