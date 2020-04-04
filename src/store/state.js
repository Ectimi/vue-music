const state = {
    //是否登录
    isLogin:false,

    //用户id
    userId:'',

    //是否正在播放
    isPlay:false,

    //是否显示播放页面
    isShowPlayView:false,

    //当前播放歌曲索引
    currentIndex:0,

    //当前播放歌曲列表
    songsArray:[],

    //当前歌曲播放时间
    currentTime:0,

    //当前歌曲播放进度（百分比）
    currentPercent:0,

    //播放模式   0:列表循环  1：随机  2：单曲循环
    playMode:0,

    //当前歌词行
    currentLineNo:0,
    
    //当前正在播放的歌曲信息
    songInfo:{
        id:'',
        title:'',
        singer:'',
        coverImg:'',
        src:'',
        lyric:'',
        duration:''
    }
}

export default state