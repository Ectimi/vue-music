import axios from '../lib/axios-init'
import { api_login, api_getSongDetail, api_getSongSrc, api_getSongLyric } from '../api'
import { joinObjectArray } from '../lib/utils'

const actions = {
    /**
     * phone:手机号
     * password:密码
     * vue:vue实例
     */
    login({ commit }, { phone, password, vue }) {
        api_login({ phone, password })
            .then(result => {
                console.log("登录成功", result);

                if (result.data.code != 200) {
                    vue.$toast("登录失败,请检查账号或者密码！");
                } else {
                    commit("changeLogin", true);
                    commit('setUserId',result.data.account.id);
                    console.log(result.data.account.id)
                    vue.$router.push("/home");
                }
            })
            .catch(err => {
                console.log("登录失败==>", err);
            });
    },
    /**
     * @description 根据歌曲 id 请求拿到歌曲信息，保存到 songInfo 中
     */
    getSongInfo({ state }, id) {
        axios.all([
            api_getSongDetail({ ids: id }),
            api_getSongSrc({ id }),
            api_getSongLyric({ id })
        ]).then(axios.spread((detailData, srcData, lyricData) => {
            let detail = detailData.data.songs[0]
            state.songInfo.id = detail.id;
            state.songInfo.title = detail.name;
            state.songInfo.coverImg = detail.al.picUrl;
            state.songInfo.singer = joinObjectArray(detail.ar, '/', 'name')
            state.songInfo.src = srcData.data.data[0].url
            state.songInfo.lyric = lyricData.data.lrc.lyric

            //歌词处理
            var lyric = lyricData.data.lrc.lyric
            lyric = state.songInfo.lyric.split('\n');

            var lyricArray = []

            for (var i = 0; i < lyric.length; i++) {
                var item = lyric[i]
                if (item != "") {
                    var lyricObj = {}

                    //获取取时间 格式：00:04.050
                    var time = item.substring(item.indexOf('[') + 1, item.indexOf(']'))

                    //转化为秒
                    time = (time.split(":")[0] * 60 + parseFloat(time.split(":")[1])).toFixed(3)

                    var text = item.substring(item.indexOf("]") + 1, item.length)

                    lyricObj.time = parseFloat(time)

                    lyricObj.text = text

                    lyricObj.lineno = i + 1

                    lyricArray.push(lyricObj)
                }
            }

            state.songInfo.lyric = lyricArray
        }))
    },

    //点击播放
    tapPlay({ dispatch, commit }, payload) {
        dispatch("getSongInfo", payload.id);
        commit("togglePlay", true);
    }

}

export default actions