<template>
  <div class="container songlist-detail" ref="songlistDetail">
    <van-nav-bar
      ref="navBar"
      title="歌单"
      :border="false"
      left-arrow
      @click-left="()=>{this.$router.push('/')}"
    />
    <!-- 模糊背景 -->
    <div class="bgCover">
      <img :src="detailData.coverImgUrl" />
    </div>

    <!-- 歌单介绍 -->
    <van-row class="introduce">
      <van-col span="11" offset="1" class="left">
        <img :src="detailData.coverImgUrl" class="coverImg" />
        <div class="play-count">
          <van-icon name="play" />
          <span>{{detailData.playCount}}</span>
        </div>
      </van-col>
      <van-col span="10" offset="1" class="right">
        <div class="right-top">
          <div class="van-multi-ellipsis--l2 name">{{detailData.name}}</div>
          <div class="creator">
            <img :src="detailData.creator&&detailData.creator.avatarUrl" class="avatar" />
            <div class="van-ellipsis nickname">{{detailData.creator&&detailData.creator.nickname}}</div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="right-bottom" @click="displayPopup(1)">
          <div class="van-multi-ellipsis--l2 description">{{detailData.description}}</div>
          <van-icon name="arrow" />
        </div>
      </van-col>
    </van-row>

    <!-- 功能按钮 -->
    <van-row class="effect-btn">
      <van-col span="10" offset="1">
        <van-icon name="comment-o" />
        <div>{{detailData.commentCount}}</div>
      </van-col>
      <van-col span="10" offset="1">
        <van-icon name="passed" />
        <div>多选</div>
      </van-col>
    </van-row>

    <!-- 歌曲列表 -->
    <div class="list-box" ref="listBox">
      <van-row type="flex" align="center" justify="center">
        <van-col span="2" offset="1">
          <van-icon name="play-circle-o" @click="playAll" />
        </van-col>
        <van-col span="5" style="fontSize:16px" @click="playAll">播放全部</van-col>
        <van-col
          span="6"
          offset="0"
          style="fontSize:14px;color:white"
        >(共{{detailData.tracks&&detailData.tracks.length}}首)</van-col>
        <van-col span="8" offset="4" style="marginLeft:50px">
          <van-button
            round
            type="info"
            color="linear-gradient(to right, rgb(255, 89, 75), rgb(255, 30, 28))"
          >+收藏{{detailData.subscribedCount>10000?'('+Math.floor(detailData.subscribedCount/10000)+'万)':'('+detailData.subscribedCount+')'}}</van-button>
        </van-col>
      </van-row>

      <div class="wrapper" ref="wrapper">
        <div class="child-wrapper">
          <van-row
            class="song-item"
            type="flex"
            align="center"
            v-for="(item,index) in detailData.tracks"
            :key="index"
            :data-id="item.id"
            :data-name="item.name"
            :data-artists="joinObjectArray(item.ar,'/','name')"
            @click="play($event)"
          >
            <van-icon class="volume-icon" v-if="item.id==songInfo.id" name="volume-o" />
            <van-col v-else offset="1" class="index">{{index+1}}</van-col>
            <van-col span="20" offset="1">
              <div class="name van-ellipsis" :class="item.id==songInfo.id?'currentPlay':''">{{item.name}}</div>
              <div class="singer van-ellipsis">{{joinObjectArray(item.ar,'/','name')}}</div>
            </van-col>
            <van-icon class="ellipsis" name="ellipsis" />
          </van-row>
        </div>
      </div>
    </div>

    <!-- 弹出框 -->
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <Popup class="popup" v-if="show" :detailData="detailData" @hidePopup="displayPopup(0)"></Popup>
    </transition>
  </div>
</template>

<script>
import { api_getSonglistDetail } from "../api";
import { joinObjectArray } from "../lib/utils";
import { mapState } from "vuex";
import Popup from "../components/Popup";
import BScroll from "better-scroll";
import {mixins} from '../mixins/mixins';

export default {
  name: "songlistDetail",
  mixins:[mixins],
  data() {
    return {
      detailData: "",
      show: false, //是否显示弹出框（歌单描述详情）
      scroll: ""
    };
  },
  computed: {
    ...mapState(["songInfo", "songsArray"])
  },
  created() {
    api_getSonglistDetail({ id: this.$route.params.id }).then(data => {
      this.detailData = data.data.playlist;
    });
  },
  mounted() {
    this.$nextTick(() => {
      //实例化 better-scroll
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          scrollY: true,
          click: true
        });
      } else {
        this.scroll.refresh(); //如果dom结构发生改变调用该方法
      }
    });
  },
  methods: {
    joinObjectArray,
    //显示弹出框 1：显示  0：隐藏
    displayPopup(type) {
      if (type == 1) {
        this.$refs.songlistDetail.style.zIndex = 200;
        this.show = true;
      } else if (type == 0) {
        this.$refs.songlistDetail.style.zIndex = 20;
        this.show = false;
      }
    },
    play(e) {
      this.playMusic(e)
      this.$store.commit("changeShowPlayView", true);
    },
    playAll() {
      this.$store.commit("setSongArray", []);
      for (let i = 0, len = this.detailData.tracks.length; i < len; i++) {
        let sing = this.detailData.tracks[i];
        this.songsArray.push({
          id: sing.id,
          name: sing.name,
          artists: joinObjectArray(sing.ar, "/", "name")
        });
      }

      let params = {
        id: this.songsArray[0].id,
        name: this.songsArray[0].name,
        artists: this.songsArray[0].artists
      };

      this.$store.dispatch("tapPlay", params);
      this.$store.commit("changeShowPlayView", true);
    }
  },
  components: {
    Popup
  }
};
</script>

<style lang="scss" scoped>
@import "../../public/scss/base";
.songlist-detail {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  z-index: 20;

  //修改 van-nav-bar 导航栏的样式
  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 46px;
    background-color: transparent;

    i {
      color: white;
    }

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
    overflow: hidden;
    z-index: -1;

    img {
      width: 100%;
      height: auto;
      filter: blur(15px) brightness(70%);
      transform: scale(1.2);
      opacity: 0.5;
    }
  }

  // 歌单介绍
  .introduce {
    color: white;
    height: 150px;
    margin-top: 46px;

    .left {
      position: relative;

      .play-count {
        position: absolute;
        top: 0;
        right: 30px;
        // width: 60px;
        height: 20px;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .coverImg {
      width: 150px;
      height: auto;
    }

    .name {
      max-height: 40px;
      font-size: 14px;
      font-weight: bold;
    }

    .creator {
      display: flex;
      align-items: center;

      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      .nickname {
        max-width: 120px;
        margin: 15px 10px;
      }
    }

    .right-bottom {
      display: flex;
      align-items: center;

      .description {
        max-height: 35px;
      }
    }
  }

  //功能按钮
  .effect-btn {
    margin-top: 10px;

    .van-col {
      color: white;
      font-size: 14px;
      text-align: center;
    }

    i {
      font-size: 20px;
    }
  }

  //列表
  .list-box {
    margin-top: 10px;
    padding-top: 10px;
    background-color: #fff;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    .wrapper {
      width: 100%;
      height: 400px;
      overflow-y: auto;
    }

    .child-wrapper {
      padding-bottom: 100px;
    }

    i {
      font-size: 22px;
    }

    .song-item {
      position: relative;
      margin-top: 5px;

      .volume-icon{
        margin-left: 10px;
        font-size: 14px;
        color:$baseRed;
      }

      .index {
        font-size: 16px;
        color: rgb(179, 179, 179);
      }

      .name {
        max-width: 70%;
        font-size: 16px;
        color: black;
      }

      .singer {
        max-width: 70%;
        color: rgb(179, 179, 179);
      }

      .ellipsis {
        position: absolute;
        top: 5px;
        right: 5px;
        transform: rotateZ(90deg);
        color: rgb(179, 179, 179);
      }

      .currentPlay{
        color:$baseRed;
      }
    }
  }

  //弹出框 -> 歌单详情
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 50px);
    padding-bottom: 10px;
    color: white;
    z-index: 200;
    overflow-y: hidden;
  }
}
</style>