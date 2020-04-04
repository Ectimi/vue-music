<template>
  <div id="recommendContainer">
    <van-nav-bar
      ref="navBar"
      title="每日推荐"
      :border="false"
      left-arrow
      @click-left="()=>{this.$router.push('/')}"
    />
    <div class="play-btn" @click="playAll">
      <van-icon name="play-circle-o" />
      <span class="text">播放全部</span>
    </div>
    <ul class="song-list">
      <li
        class="song-item"
        v-for="(item,index) in recomendData"
        :key="index"
        :data-id="item.id"
        :data-name="item.name"
        :data-artists="joinObjectArray(item.artists,'/','name')"
        @click="playMusic"
      >
        <img :src="item.album && item.album.blurPicUrl" alt class="cover-img" />
        <van-icon class="volume-icon" v-if="item.id==songInfo.id" name="volume-o" />
        <div class="info">
          <p class="name van-ellipsis" :class="item.id==songInfo.id?'currentPlay':''">{{item.name}}</p>
          <p
            class="singer van-ellipsis"
          >{{joinObjectArray(item.artists,'/','name')}} - {{item.album && item.album.name}}</p>
        </div>
        <van-icon class="ellipsis" name="ellipsis" />
      </li>
    </ul>
  </div>
</template>

<script>
import { api_getRecommendSongs } from "../api";
import { joinObjectArray } from "../lib/utils";
import { mapState } from "vuex";
import { mixins } from "../mixins/mixins";

export default {
  name: "Recommend",
  mixins: [mixins],
  data() {
    return {
      recomendData: []
    };
  },
  computed: {
    ...mapState(["songInfo", "songsArray"])
  },
  created() {
    api_getRecommendSongs({ timestamp: new Date().getTime() }).then(data => {
      this.recomendData = data.data.data.dailySongs;
      console.log(this.recomendData);
    });
  },
  methods: {
    joinObjectArray,
    playAll() {
      this.$store.commit("setSongArray", []);
      for (let i = 0, len = this.recomendData.length; i < len; i++) {
        let sing = this.recomendData[i];
        this.songsArray.push({
          id: sing.id,
          name: sing.name,
          artists: joinObjectArray(sing.artists, "/", "name")
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
  }
};
</script>

<style lang="scss">
@import "../../public/scss/base";

#recommendContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 20;
  overflow-y: auto;

  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 46px;

    i {
      color: black;
    }
  }

  .play-btn {
    height: 30px;
    line-height: 30px;
    margin-top: 46px;
    margin-left: 10px;
    font-size: 16px;

    .text {
      margin-left: 10px;
    }
  }
  .song-list {
    padding: 0 10px;
    padding-bottom: 50px;
    box-sizing: border-box;
  }

  .song-item {
    display: flex;
    margin-bottom: 10px;

    .cover-img {
      width: 50px;
      height: 50px;
      border-radius: 5px;
    }

    .volume-icon {
      margin-left: 10px;
      margin-top: 20px;
      font-size: 14px;
      color: $baseRed;
    }

    .info {
      margin-left: 20px;
      width: 60%;
    }

    .name {
      margin: 5px 0;
    }

    .ellipsis {
      margin-left: 5px;
      transform: rotateZ(90deg);
      color: rgb(179, 179, 179);
    }
  }
}
</style>