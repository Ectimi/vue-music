import axios from '../lib/axios-init'

const RECOMMEND_URL = '/recommend/songs';

function api_getRecommendSongs(params){
    return axios.get(RECOMMEND_URL, { params })
}

export{
    api_getRecommendSongs
}