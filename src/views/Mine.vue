<template>
  <div id="mineContainer" class="container">
    <p class="title">我的音乐</p>
    <van-divider />
    <van-loading color="rgb(255, 45, 33)" v-if="showLoading"/>
    <van-collapse v-model="activeName">
      <van-collapse-item :title="'创建歌单'+ createdList.length" name="1">
        <ul class="playlist-box">
          <li
            class="playlist-item"
            v-for="(item,index) in createdList"
            :key="index"
            :data-id="item.id"
            @click="()=>{$router.push({name:'SonglistDetail',params:{id:item.id}})}"
          >
            <!-- <img :src="item.coverImgUrl" alt class="cover-img" /> -->
            <van-image class="cover-img" :src="item.coverImgUrl" lazy-load />
            <div class="info">
              <p class="name van-multi-ellipsis--l2">{{ index==0?"喜欢的音乐":item.name}}</p>
              <p class="count">{{item.trackCount}}首</p>
            </div>
          </li>
        </ul>
      </van-collapse-item>
      <van-collapse-item :title="'收藏歌单'+ collectedList.length" name="2">
        <ul class="playlist-box">
          <li
            class="playlist-item"
            v-for="(item,index) in collectedList"
            :key="index"
            :data-id="item.id"
            @click="()=>{$router.push({name:'SonglistDetail',params:{id:item.id}})}"
          >
            <!-- <img :src="item.coverImgUrl" alt class="cover-img" /> -->
             <van-image class="cover-img" :src="item.coverImgUrl" lazy-load />
            <div class="info">
              <p class="name van-multi-ellipsis--l2">{{item.name}}</p>
              <p class="count">{{item.trackCount}}首</p>
            </div>
          </li>
        </ul>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { api_getUserPlaylist } from "../api";
import { mapState } from "vuex";

export default {
  name: "Mine",
  data() {
    return {
      showLoading:true,
      createdList: [], //用户创建的歌单
      collectedList: [], //用户收藏的歌单
      activeName: ["1", "2"]
    };
  },
  computed: {
    ...mapState(["userId"])
  },
  created() {
    //默认返回31条数据，传入limit可限定返回数据条数，由于不清楚共有多少条，所以可以设置值大一点
    api_getUserPlaylist({ uid: this.userId, limit: 999 }).then(data => {
      var playlist = data.data.playlist;
      for (var i = 0, len = playlist.length; i < len; i++) {
        if (playlist[i].creator.userId === this.userId) {
          this.createdList.push(playlist[i]);
        } else {
          this.collectedList.push(playlist[i]);
        }
      }
      // console.log(this.createdList);
      // console.log(this.collectedList);
      this.showLoading = false;
    });
  }
};
</script>

<style lang="scss">
#mineContainer {
  position: relative;
  overflow-y: auto;
  padding-top: 43px;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 43px;
    line-height: 43px;
    font-size: 16px;
    text-align: center;
    background-color: #fff;
    z-index: 10;
  }

  .van-loading{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index: 20;
  }

  .van-divider {
    margin: 0;
  }

  .playlist-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .playlist-item {
    flex: 0 0 50%;
    margin-top: 10px;

    .cover-img {
      display: block;
      float: left;
      width: 80px;
      height: 80px;
    }

    .info {
      float: left;
      margin-left: 10px;
      margin-top: 20px;
    }

    .name {
      word-wrap: break-word;
      width: 80px;
    }
  }
}
</style>