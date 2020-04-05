<template>
  <div id="app">
    <!-- 播放音频 -->
    <audio class="audio" :src="songInfo.src" ref="audio"></audio>

    <!-- 登录页面 -->
    <Login v-if="!$store.state.isLogin"></Login>

    <!-- 播放页面 -->
    <transition
      enter-active-class="animated slideInRight faster"
      leave-active-class="animated slideOutRight faster"
      mode="out-in"
    >
      <Play class="play-view" v-if="isShowPlayView" />
    </transition>

    <!-- 右上角圆形进度条 -->
    <van-circle
      v-model="currentRate"
      :rate="currentPercent"
      layer-color="rgb(231, 231, 231)"
      color="rgb(255, 45, 33)"
    />

    <!-- 右上角转动的碟子 -->
    <div
      class="plate"
      :class="isPlay?'turn':''"
      :style="{background:'url('+  plateBg +')'}"
      ref="plate"
      @click="()=>{$store.commit('changeShowPlayView',true)}"
    ></div>

    <transition
      
      :enter-active-class=enterActiveClass
      :leave-active-class=leaveActiveClass
      :mode=mode
    >
      <router-view></router-view>
    </transition>

    <!-- <keep-alive v-else>
      <router-view></router-view>
    </keep-alive> -->

    <!-- 底部tab栏 -->
    <div class="tabbar">
      <router-link to="/home" tag="div">
        <span class="iconfont icon-yinle1"></span>发现
      </router-link>

      <router-link to="/mine" tag="div">
        <span class="iconfont icon-yinle"></span>我的
      </router-link>

      <router-link to="/account" tag="div">
        <van-icon name="user-circle-o" />账号
      </router-link>
    </div>
  </div>
</template>

<script>
import Login from "./views/Login";
import Play from "./views/Play";
import { mapState } from "vuex";

export default {
  data() {
    return {
      currentRate: 30,
      showPopup: false,
      rate: 0,
      enterActiveClass:"",
      leaveActiveClass:"",
      mode:"out-in"
    };
  },
  computed: {
    ...mapState([
      "isPlay",
      "isShowPlayView",
      "songInfo",
      "playMode",
      "currentPercent",
      "songsArray",
      "currentIndex",
      "currentLineNo"
    ]),
    plateBg() {
      return this.songInfo.coverImg
        ? this.songInfo.coverImg
        : require("../public/images/plate.png");
    }
  },
  watch: {
    isPlay(newVal, oldVal) {
      if (newVal) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    '$route'(to,from){
      //如果当前路由由 home 进入 songlistdetail 或者由 mine 进入 songlistdetail 添加过渡路由
      if(to.path.indexOf('songlistdetail')>-1 && ((from.path.indexOf('home')>-1)||(from.path.indexOf('mine')>-1))){
        this.mode = "out-in"
        this.enterActiveClass="animated slideInRight faster";
        this.leaveActiveClass=""
      }else if(from.path.indexOf('songlistdetail')>-1 && (to.path.indexOf('home')>-1 || to.path.indexOf('category')>-1 )){
        this.mode = "in-out"
        this.enterActiveClass="animated slideInLeft faster"
        this.leaveActiveClass="animated slideOutRight faster"
      }else{
        this.mode = ""
        this.enterActiveClass=""
        this.leaveActiveClass=""
      }
    }
  },
  methods: {},
  created() {
    //判断本地存在账号密码，如果存在，直接登录
    let phone = this.$ls.get("phone");
    let password = this.$ls.get("password");
    if (phone && password) {
      this.$store.dispatch("login", { phone, password, vue: this });
    }
    console.log(this.$route);
  },
  mounted() {
    let audio = this.$refs.audio;

    //在播放被终止时触发,例如, 当播放中的音频重新开始播放时会触发这个事件
    audio.addEventListener("abort", () => {
      this.$store.commit("setCurrentLineNo", 0);
    });

    //监听是否可以播放
    audio.addEventListener("canplay", () => {
      // console.log(audio.duration) 00:00
      this.songInfo.duration = audio.duration;
      audio.play();
    });

    //监听是否可以播放
    audio.addEventListener("playing", () => {
      if (this.isPlay) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    //监听是否暂停   播放暂停时触发。
    audio.addEventListener("pause", () => {
      this.$store.commit("togglePlay", false);
    });

    //监听播放过程  元素的currentTime属性表示的时间已经改变。
    audio.addEventListener("timeupdate", () => {
      this.$store.commit("setCurrentTime", audio.currentTime);
      this.$store.commit(
        "setCurrentPercent",
        (audio.currentTime / audio.duration) * 100
      );
    });

    //监听歌曲结束播放
    audio.addEventListener("ended", () => {
      //播放结束后 重置 时间和百分比进度，并把播放状态设置为停止
      this.$store.commit("setCurrentTime", "");
      this.$store.commit("setCurrentPercent", 0);

      //如果当前播放模式是列表循环，且播放的歌曲是列表中的最后一首，则停止，否则继续播放下一首
      if (
        this.currentIndex === this.songsArray.length - 1 &&
        this.playMode === 0
      ) {
        this.$store.commit("togglePlay", false);
      } else {
        this.$store.commit("togglePlay", false);
        //如果播放模式是 列表循环 或 随机 则需要改变 currentIndex，否则是单曲循环则不用改变
        if (this.playMode === 1 || this.playMode === 0) {
          this.$store.commit("switchMusic", "next");
        }
        this.$store.dispatch(
          "getSongInfo",
          this.songsArray[this.currentIndex].id
        );
        this.$store.commit("togglePlay", true);
      }
    });
  },
  components: {
    Login,
    Play
  }
};
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  padding-bottom: 105px;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;

  .play-view {
    z-index: 300;
  }

  .tabbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-image: linear-gradient(rgb(246, 244, 244), rgb(252, 251, 251));
    opacity: 0.95;
    z-index: 100;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      width: 33%;
      height: 100%;
      font-size: 16px;
      text-align: center;
    }

    .router-link-active {
      color: red !important;
    }
  }

  //歌曲播放进度
  .van-circle {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 30px !important;
    height: 30px !important;
    z-index: 100;
  }

  //右上角转动的碟子
  .plate {
    position: fixed;
    top: 13.5px;
    right: 13.5px;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    // background-color: red!important;
    background-size: cover !important;
    z-index: 100;
  }

  .turn {
    animation: turn 10s linear infinite;
  }
}

//转动动画
@keyframes turn {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
a {
  color: black;
}
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  .container {
    width: 100%;
    height: 100%;
  }
}
</style>
