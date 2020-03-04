<template>
  <div class="playContainer">
    <van-nav-bar
      :title="songInfo.title"
      left-arrow
      :border="false"
      @click-left="()=>{$store.commit('changeShowPlayView',false)}"
    />

    <!-- 模糊背景 -->
    <div class="bgCover">
      <img :src="songInfo.coverImg||require('../../public/images/plate.png')" />
    </div>

    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <!-- 碟子 -->
      <div class="center plate" key="plate" v-if="!showLyric" @click="()=>{this.showLyric=true}">
        <img
          :class="isPlay?'play':''"
          :src="songInfo.coverImg||require('../../public/images/plate.png')"
        />
      </div>

      <!-- 歌词 -->
      <div class="center lyric-box" key="lyric" v-else @click="()=>{this.showLyric=false}">
        <div class="lyric">111</div>
      </div>
    </transition>

    <!-- 按钮 -->
    <van-row class="btn-box" type="flex" justify="space-around">
      <van-col>
        <van-icon name="like-o" />
      </van-col>
      <van-col>
        <van-icon name="comment-o" />
      </van-col>
      <van-col>
        <van-icon class="ellipsis" name="ellipsis" />
      </van-col>
    </van-row>

    <!-- 进度条 -->
    <div class="progress-bar">
      <span>{{formatTime(currentTime) || '00:00'}}</span>
      <van-slider :value="currentPercent" active-color="white" @input="inputHandler" />
      <span>{{formatTime(songInfo.duration) || '00:00'}}</span>
    </div>

    <!-- 播放控制按钮 -->
    <van-row class="contoller" type="flex" align="center" justify="space-around">
      <van-col class="btn mode-btn" @click="switchPlayMode">
        <span
          class="iconfont"
          :class="playMode==0?'icon-liebiaoxunhuan':playMode==1?'icon-suiji':'icon-xunhuan'"
        ></span>
      </van-col>
      <van-col class="btn prev-btn" @click="switchMusic('prev')">
        <span class="iconfont icon-shangyiqu101"></span>
      </van-col>
      <van-col class="btn play-btn" @click="togglePlay">
        <span class="iconfont" :class="isPlay?'icon-zanting':'icon-bofang'"></span>
      </van-col>
      <van-col class="btn next-btn" @click="switchMusic('next')">
        <span class="iconfont icon-xiayiqu101"></span>
      </van-col>
      <van-col class="btn list-btn">
        <span class="iconfont icon-liebiao"></span>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { s_to_hs, RandomNumBoth } from "../lib/utils";

export default {
  name: "Play",
  data() {
    return {
      showLyric: false //是否显示歌词
    };
  },
  computed: {
    ...mapState([
      "isPlay",
      "isShowPlayView",
      "songsArray",
      "songInfo",
      "currentTime",
      "currentPercent",
      "playMode",
      "currentIndex"
    ])
  },
  methods: {
    //切换播放模式
    switchPlayMode() {
      let tips = ["列表循环", "随机播放", "单曲循环"];
      this.$store.commit("setPlayMode", (this.playMode + 1) % 3);
      this.$toast(tips[this.playMode]);
    },
    formatTime(time) {
      return s_to_hs(time).split(".")[0];
    },
    //进度条滑动事件 这里的 value范围是 0-100，所以计算百分比时要 /100
    inputHandler(value) {
      if (this.songInfo.id) {
        let audio = document.querySelector(".audio");
        //设置拖动后的歌曲播放时间
        audio.currentTime = this.songInfo.duration * (value / 100); //总时长 * 进度条百分比
        //更新当前播放时间
        this.$store.commit("setCurrentTime", audio.currentTime);
        //更新当前百分比
        this.$store.commit(
          "setCurrentPercent",
          this.currentTime / this.songInfo.duration
        );
      }
    },
    //暂停
    togglePlay() {
      if (this.songInfo.id) {
        if (this.isPlay) {
          this.$store.commit("togglePlay", false);
        } else {
          this.$store.commit("togglePlay", true);
        }
      }
    },
    //切换音乐 type: next || prev
    switchMusic(type) {
      if (this.songInfo.id) {
        this.$store.commit("switchMusic", type);
        this.$store.dispatch(
          "getSongInfo",
          this.songsArray[this.currentIndex].id
        );

        let audio = document.querySelector(".audio");
        audio.pause();
        audio.load();
        audio.play();
      }
    }
  }
};
</script>

<style lang="scss">
.playContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;

  //导航栏
  .van-nav-bar {
    background-color: transparent;

    i,
    .van-nav-bar__title {
      color: white;
    }
  }

  //背景模糊
  .bgCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;

    img {
      width: 100%;
      height: 100%;
      filter: blur(15px) brightness(70%);
      transform: scale(1.5);
      opacity: 0.5;
    }
  }

  //碟子
  .plate {
    img {
      width: 250px;
      height: 250px;
      border-radius: 50%;
    }

    .play {
      animation: turn 10s linear infinite;
    }
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70%;
  }

  // 按钮
  .btn-box {
    color: white;
    font-size: 24px;
    .ellipsis {
      transform: rotateZ(90deg);
    }
  }

  // 进度条
  .progress-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    margin-top: 20px;

    span {
      color: white;
    }

    .van-slider {
      width: 75%;
      background-color: rgb(160, 147, 139);
    }

    .van-slider__button {
      width: 10px;
      height: 10px;
    }
  }

  .contoller {
    margin-top: 30px;
    color: #fff;

    .btn span {
      font-size: 25px;
    }

    .play-btn span {
      font-size: 40px;
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
}
</style>