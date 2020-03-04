import axios from '../lib/axios-init'

const DETAIL_URL = "/playlist/detail"

function api_getSonglistDetail(params) {
    return axios.get(DETAIL_URL, { params })
}

export {
    api_getSonglistDetail
}