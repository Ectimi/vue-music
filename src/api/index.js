import { api_login, api_register,api_getCaptcha } from './login'
import { api_getBanner, api_getPlaylistRecommend, api_getNewSong, api_getNewAlbum } from './home'
import { api_getCategory, api_getPlayListByCategory } from './category'
import { api_getSonglistDetail } from './songlistDetail'
import {api_getSongDetail,api_getSongSrc,api_getSongLyric} from './play'

export {
    // login view
    api_login,
    api_register,
    api_getCaptcha,

    // home view
    api_getBanner,
    api_getPlaylistRecommend,
    api_getNewSong,
    api_getNewAlbum,

    // cagegory view 
    api_getCategory,
    api_getPlayListByCategory,

    // songlistDetail view
    api_getSonglistDetail,
    
    // play view
    api_getSongDetail,
    api_getSongSrc,
    api_getSongLyric
}