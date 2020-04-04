<template>
  <div id="homeContainer" class="container">
    <!-- <transition
      enter-active-class="animated slideInRight faster"
      leave-active-class="animated slideOutRight faster"
      mode="out-in"
    >
      <router-view></router-view>
    </transition> -->
    <!-- 搜索框 -->
    <van-row class="search-box">
      <van-col span="24">
        <van-search v-model="inputValue" placeholder="请输入搜索关键词" />
      </van-col>
    </van-row>
    <!-- 下拉刷新组件 -->
    <van-pull-refresh v-model="isLoading" @refresh="getData">
      <!-- 轮播图 -->
      <van-row>
        <van-col span="22" offset="1">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="rgb(255, 45, 33)">
            <van-swipe-item v-for="(banner,index) in banners" :key="index">
              <div class="banner-image" :style="{'background':`url(${banner.imageUrl}) no-repeat`}"></div>
            </van-swipe-item>
          </van-swipe>
        </van-col>
      </van-row>

      <!-- 功能按钮 -->
      <div class="feature-button">
        <van-row>
          <van-col span="8">
            <div class="circle">
              <van-icon class="iconfont" class-prefix="icon" name="rili" />
              <span class="date">{{getCurrentDay()}}</span>
            </div>
            <div class="text">每日推荐</div>
          </van-col>
          <van-col span="8">
            <div class="circle">
              <van-icon class="iconfont" class-prefix="icon" name="gedan" />
            </div>
            <div class="text">歌单</div>
          </van-col>
          <van-col span="8">
            <div class="circle">
              <van-icon class="iconfont" class-prefix="icon" name="paihangbang" />
            </div>
            <div class="text">排行榜</div>
          </van-col>
        </van-row>
      </div>

      <!-- 推荐歌单 -->
      <div class="playlist-recommend">
        <van-row>
          <van-col offset="1" class="title">推荐歌单</van-col>
        </van-row>
        <van-row>
          <van-col offset="1" class="description">为你精挑细选</van-col>
        </van-row>
        <div class="songList" ref="wrapper">
          <ul class="content">
            <li
              v-for="(songList,index) in playlistRecommend"
              :key="index"
              @click="()=>{$router.push({name:'SonglistDetail',params:{id:songList.id}})}"
            >
              <div
                class="songList-image"
                :style="{'background':`url(${songList.picUrl}) no-repeat`}"
              ></div>
              <div class="songList-name van-multi-ellipsis--l2">{{songList.name}}</div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 新歌推荐 -->
      <div class="newSong">
        <van-row>
          <van-col offset="1" class="title">{{new Date().getMonth()+1 + '月'+ getCurrentDay() + '日'}}</van-col>
        </van-row>
        <van-row>
          <van-col offset="1" class="description">
            <span :class="{current:switchIndex === 0}" @click="()=>{this.switchIndex = 0}">新歌</span> |
            <span :class="{current:switchIndex === 1}" @click="()=>{this.switchIndex = 1}">新碟</span>
          </van-col>
        </van-row>

        <van-row
          v-for="(item,index) in showData"
          :key="index"
          class="songItem"
          :data-id="item.id"
          :data-img="item.picUrl"
          :data-name="item.name"
          :data-artists="item.song&&joinObjectArray(item.song.artists,'/','name')"
          @click="flyAnimation($event)"
        >
          <van-col span="6" offset="1" class="left">
            <img :src="item.picUrl" class="newSong-image" />
          </van-col>
          <van-col offset="1" span="11" class="right">
            <div class="van-ellipsis" style="width:100%;fontWeight:600;fontSize:14px">{{item.name}}</div>
            <div
              v-if="switchIndex==0"
              style="color:rgb(143, 143, 143)"
            >{{joinObjectArray(item.song.artists,'/','name')}}</div>
            <div v-else style="color:rgb(143, 143, 143)">{{item.artist.name}}</div>
          </van-col>
          <van-col v-if="switchIndex==0" offset="3" span="4" class="play-icon">
            <van-icon
              v-if="item.id!=songInfo.id"
              class="iconfont"
              class-prefix="icon"
              name="bofang"
            />
            <van-icon class="volume-icon" v-if="item.id==songInfo.id" name="volume-o" />
          </van-col>
        </van-row>

        <!-- 飞入动画 -->
        <transition name="fly" v-on:before-enter="beforeEnter" v-on:enter="enter">
          <div v-if="show" class="fly">
            <div :style="{background:'url('+flyImage+')'}"></div>
          </div>
        </transition>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  api_getBanner,
  api_getPlaylistRecommend,
  api_getNewSong,
  api_getNewAlbum,
  api_getSongDetail
} from "../api";
import BScroll from "better-scroll";
import { joinObjectArray } from "../lib/utils";
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      show: false, //飞入动画
      startEl: "", //动画起始元素
      inputValue: "", //搜索框的值
      banners: [], //轮播图
      playlistRecommend: [], //推荐歌单
      newSongs: [], //新歌
      newAlbums: [], //新碟
      scroll: "", //better-scroll
      switchIndex: 0, // 0:显示新歌 1:显示新碟
      isLoading: false,
      flyImage: ""
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState(["isPlay", "isShowPlayView", "songInfo", "songsArray"]),

    //根据 switchIndex 的值，决定显示新歌还是新碟
    showData() {
      if (this.switchIndex == 0) {
        return this.newSongs;
      } else {
        console.log(this.newAlbums);
        return this.newAlbums;
      }
    }
  },
  mounted() {
    //实例化 better-scroll
    if (!this.scroll) {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        eventPassthrough: "vertical"
      });
    } else {
      this.scroll.refresh(); //如果dom结构发生改变调用该方法
    }
  },
  methods: {
    //根据接口返回的歌手数组数据，拼接出歌手名字符串
    joinObjectArray,
    //获取数据
    getData() {
      this.isLoading = true;
      this.axios
        .all([
          api_getBanner(),
          api_getPlaylistRecommend(),
          api_getNewSong(),
          api_getNewAlbum({
            limit: 10
          })
        ])
        .then(
          this.axios.spread(
            (bannerData, playlistRecommendData, newSongsData, newAlbumData) => {
              // 所有请求现在都执行完成
              this.banners = bannerData.data.banners;
              this.playlistRecommend = playlistRecommendData.data.result;
              this.newSongs = newSongsData.data.result;
              this.newAlbums = newAlbumData.data.albums;
              this.isLoading = false;
            }
          )
        );
    },
    //获取当天日期
    getCurrentDay() {
      return new Date().getDate();
    },
    //飞入动画
    flyAnimation(e) {
      if (this.switchIndex === 0) {
        let currentTarget = e.currentTarget;
        let imgUrl = currentTarget.getAttribute("data-img");
        //如果是第一次点击，则展示飞入动画，并播放，如果播放的是当前点击的歌曲，则进入播放页面
        if (this.songInfo.id == currentTarget.getAttribute("data-id")) {
          this.$store.commit("changeShowPlayView", true);
        } else {
          this.flyImage = imgUrl;
          this.startEl = currentTarget.querySelector(".newSong-image");
          this.show = true;
          this.play(e)
        }
      }
    },
    //动画进入的第一帧，动画的元素刚开始是隐藏的，这里设置其刚显示的时候的样式
    beforeEnter(el) {
      this.$nextTick(() => {
        let { x, y } = this.startEl.getBoundingClientRect();
        let div = el.querySelector("div");
        div.style.width = getComputedStyle(this.startEl).width;
        div.style.height = getComputedStyle(this.startEl).height;
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.borderRadius = "50%";
        el.style.opacity = 0.5;
      });
    },
    //动画运动的过程中
    enter(el, done) {
      this.$nextTick(() => {
        let plate = document.querySelector(".plate");
        let { x, y } = plate.getBoundingClientRect();
        let div = el.querySelector("div");
        el.style.top = y + "px";
        div.style.width = getComputedStyle(plate).width;
        div.style.height = getComputedStyle(plate).height;
        div.style.borderRadius = "50%";
        div.style.left = x + "px";

        //监听动画结束，把动画元素隐藏，并设置为 display:none
        let remove = () => {
          done();
          el.removeEventListener("transitionend", remove);
          this.show = false;
          el.style.display = "none";
        };
        el.addEventListener("transitionend", remove);
      });
    },
    //播放
    play(e) {
      if (this.switchIndex === 0) {
        let id = e.currentTarget.getAttribute("data-id");
        let sing = {
          id,
          name: e.currentTarget.getAttribute("data-name"),
          artists: e.currentTarget.getAttribute("data-artists")
        }
        this.$store.dispatch("tapPlay", sing);
        this.songsArray.push(sing)

      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../public/scss/base";

#homeContainer {
  position: relative;
  padding-top: 55px;
  overflow-y: auto;

  // 输入框
  .search-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    z-index: 10;

    .van-search {
      width: 90%;
    }
    .van-search__content {
      border-radius: 15px;
    }
  }

  //轮播图
  .my-swipe {
    width: 100%;
    height: 130px;
    border-radius: 10px;

    .banner-image {
      width: 100%;
      height: 100%;
      background-size: cover !important;
    }
  }

  //推荐歌单
  .playlist-recommend {
    width: 100%;
    margin-top: 10px;

    .title {
      color: $baseGray;
    }

    .description {
      font-size: 16px;
      font-weight: 600;
    }

    .songList {
      width: 100%;
      height: 180px;
      overflow: hidden;

      .content {
        width: 840px;
        height: 180px;
      }
      .content > li {
        // display: inline-block;
        float: left;
        width: 120px;
        height: 100%;
        margin: 10px;
      }

      .songList-image {
        height: 120px;
        width: 120px;
        background-size: cover !important;
      }
      .songList-name {
        width: 100%;
        font-size: 14px;
        color: rgb(54, 54, 55);
      }
    }
  }

  // 功能按钮
  .feature-button {
    margin-top: 10px;

    .circle {
      position: relative;
      width: 50px;
      height: 50px;
      margin: 0 auto;
      border-radius: 50%;
      background-color: $baseRed;
      text-align: center;
      line-height: 50px;

      .date {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -37%);
        color: white;
      }

      .iconfont {
        font-size: 36px;
        color: white;
      }
    }

    .text {
      margin-top: 10px;
      text-align: center;
      color: $baseGray;
    }
  }

  // 新歌推荐
  .newSong {
    .title {
      color: $baseGray;
    }
    .description {
      font-size: 16px;
      font-weight: 600;
      color: $baseGray;
    }
    .songItem {
      margin: 15px 0;

      .volume-icon {
        font-size: 16px;
        color: $baseRed;
      }
    }
    .current {
      color: black;
    }
    .left {
      position: relative;
      width: 50px;
      height: 50px;
    }
    .right > div {
      margin-top: 5px;
    }
    .play-icon {
      margin-top: 10px;
    }
    .play-icon .iconfont {
      font-size: 20px !important;
    }
    .newSong-image {
      width: 100%;
      height: auto;
    }
  }

  //飞入动画
  .fly {
    position: fixed;
    left: 0;
    bottom: 19px;
    transition: all 0.6s ease;
    z-index: 20;

    div {
      position: absolute;
      left: 0;
      top: 0;
      background-size: cover;
      transition: all 0.6s linear;
    }
  }
}
</style>