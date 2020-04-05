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
      @after-enter="afterEnter"
    >
      <!-- 碟子 -->
      <div
        class="center"
        ref="plate"
        key="plate"
        v-if="!showLyric"
        @click="()=>{this.showLyric=true}"
      >
        <img
          :class="[isPlay?'play':'','plate']"
          :src="songInfo.coverImg||require('../../public/images/plate.png')"
        />
      </div>

      <!-- 歌词 -->
      <div class="center" ref="lyricWrapper" key="lyric" v-else @click="()=>{this.showLyric=false}">
        <div class="lyric-box" ref="lyricBox">
          <ul class="lyric-list">
            <li
              class="lyric-item"
              v-for="(item,index) in songInfo.lyric"
              :key="index"
              :class="'l'+index"
            >{{item.text}}</li>
          </ul>
        </div>
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
      <van-col class="btn list-btn" @click="()=>{this.showPopup = true}">
        <span class="iconfont icon-liebiao"></span>
      </van-col>
    </van-row>

    <van-popup v-model="showPopup" position="bottom" :style="{ height: '50%' }">
      <p class="title">当前播放({{songsArray.length}})</p>
      <ul class="singlist-box">
        <li
          class="singlist-item"
          v-for="(item,index) in songsArray"
          :key="index"
          :class="item.id==songInfo.id?'currentPlay':''"
          :data-id="item.id"
          @click="play"
        >
          <van-icon class="volume-icon" v-if="item.id==songInfo.id" name="volume-o" />
          <span class="sing-name">{{item.name}} -</span>
          <span class="artists">{{item.artists}}</span>
          <van-divider v-if="index!=songsArray.length-1" />
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { s_to_hs, RandomNumBoth } from "../lib/utils";
import BScroll from "better-scroll";

export default {
  name: "Play",
  data() {
    return {
      scroll: "",
      isScroll: true, //是否滚动歌词
      showLyric: false, //是否显示歌词
      showPopup: false
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
      "currentIndex",
      "currentLineNo"
    ])
  },
  watch: {
    currentLineNo(newValue, oldValue) {
      if (newValue != oldValue) {
        this.isScroll = true;
      }
    }
  },
  mounted() {
    document
      .querySelector(".audio")
      .addEventListener("timeupdate", this.lyricScroll);
  },
  destroyed() {
    document
      .querySelector(".audio")
      .removeEventListener("timeupdate", this.lyricScroll);
  },
  methods: {
    //歌词实时滚动
    lyricScroll() {
      let audio = document.querySelector(".audio");

      if (this.showLyric) {
        var time = parseFloat(audio.currentTime.toFixed(3));

        for (let i = 0, len = this.songInfo.lyric.length; i < len; i++) {
          if (
            this.songInfo.lyric[i].time &&
            this.songInfo.lyric[i].time <= time &&
            this.songInfo.lyric[i + 1].time >= time
          ) {
            this.$store.commit("setCurrentLineNo", i);

            var el = document.querySelector(".lightHeight");
            if (el) {
              el.classList.remove("lightHeight");
            }

            var lyricItem = document.querySelector(`.l${this.currentLineNo}`);
            if (lyricItem) {
              lyricItem.classList.add("lightHeight");
              this.scroll &&
                this.isScroll &&
                this.scroll.scrollToElement(lyricItem, 400);
            }

            break;
          }
        }
      }
    },
    //监听动画完成
    afterEnter() {
      if (this.showLyric) {
        let audio = document.querySelector(".audio");
        // 实例化 better-scroll
        this.scroll = new BScroll(this.$refs.lyricBox, {
          scrollY: true,
          click: true
        });
        this.scroll.scrollToElement(
          document.querySelector(`.l${this.currentLineNo}`),
          400
        );

        var startY, moveEndY;
        this.$refs.lyricWrapper.addEventListener("touchstart", e => {
          e.preventDefault();
          startY = e.changedTouches[0].pageY;

          this.$refs.lyricWrapper.addEventListener("touchmove", e => {
            e.preventDefault();

            moveEndY = e.changedTouches[0].pageY;

            if (moveEndY - startY > 0 || moveEndY - startY < 0) {
              this.isScroll = false;
            }
          });
        });
      }
    },
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
    },
    play(e) {
      let id = e.currentTarget.getAttribute("data-id");
      if (id !== this.songInfo.id) {
        let sing = {
          id,
          name: e.currentTarget.getAttribute("data-name"),
          artists: e.currentTarget.getAttribute("data-artists")
        };
        this.$store.dispatch("tapPlay", sing);
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

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 65%;
    overflow: hidden;

    //碟子
    .plate {
      width: 250px;
      height: 250px;
      border-radius: 50%;
    }

    .play {
      animation: turn 20s linear infinite;
    }

    //歌词
    .lyric-box {
      position: relative;
      width: 70%;
      height: 60%;
      align-self: flex-end;
      // overflow: hidden;

      .lyric-list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }

      .lyric-item {
        width: 100%;
        min-height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        letter-spacing: 1px;
        color: rgb(82, 82, 80);
      }

      .lightHeight {
        color: white;
      }
    }
  }

  // 按钮
  .btn-box {
    color: white;
    font-size: 24px;
    margin-top: 20px;

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

  .van-popup {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 15px;
    box-sizing: border-box;

    .singlist-box {
      margin-top: 10px;
    }

    .title {
      font-size: 16px;
    }

    .sing-name {
      margin-left: 10px;
      font-size: 14px;
    }

    .artists {
      color: rgb(61, 60, 60);
    }

    .currentPlay,
    .currentPlay > .artists {
      color: rgb(255, 45, 33);
    }

    .van-divider {
      margin: 10px 0;
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