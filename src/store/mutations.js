import { RandomNumBoth } from '../lib/utils'
const mutations = {
    //控制播放
    togglePlay(state, payload) {
        state.isPlay = payload
    },
    //改变登录状态
    changeLogin(state, payload) {
        state.isLogin = payload;
    },
    //切换显示 Play 页面
    changeShowPlayView(state, payload) {
        state.isShowPlayView = payload
    },
    //设置歌曲当前播放时间
    setCurrentTime(state, payload) {
        state.currentTime = payload
    },
    //设置播放进度 
    setCurrentPercent(state, payload) {
        state.currentPercent = payload
    },
    //设置播放模式  
    setPlayMode(state, payload) {
        state.playMode = payload
    },
    //设置播放索引 
    setCurrentIndex(state, payload) {
        state.currentIndex = payload
    },
    
    /*  切换音乐  
        payload === 'next' : 下一首
        payload === 'prev' : 上一首
    */
    switchMusic(state, payload) {
        //如果是列表循环或者单曲循环，直接使 currentIndex + 1 即可
        if (state.playMode === 0 || state.playMode === 2) {
            if (payload === 'next') {
                state.currentIndex =
                    state.currentIndex + 1 >= state.songsArray.length - 1
                        ? 0
                        : state.currentIndex + 1;
            } else if (payload === 'prev') {
                state.currentIndex =
                    state.currentIndex - 1 < 0
                        ? state.songsArray.length - 1
                        : state.currentIndex - 1;
            }
        } else {
            state.currentIndex = RandomNumBoth(0, state.songsArray.length - 1)
        }
    }
}

export default mutations