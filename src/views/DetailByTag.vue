<template>
  <div id="detailContainer" class="conatiner">
    <van-loading v-if="loading" size="24px" color="rgb(255, 45, 33)">加载中...</van-loading>
    <NavBar class="navbar" :title="$route.params.tag" @click-left="()=>{$router.go(-1)}"></NavBar>
    <van-row class="playlists" type="flex" justify="space-between">
      <van-col
        span="7"
        class="playlist-item"
        v-for="(item,index) in playlists"
        :key="index"
        @click="()=>{$router.push({name:'SonglistDetail',params:{id:item.id}})}"
      >
        <van-image class="cover-img" :src="item.coverImgUrl" lazy-load />
        <p class="name van-multi-ellipsis--l2">{{item.name}}</p>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { api_getPlayListByCategory } from "../api";

import NavBar from "../components/NavBar";

export default {
  data() {
    return {
      loading: true,
      playlists: []
    };
  },
  created() {
    let cat = this.$route.params.tag;
    api_getPlayListByCategory({ cat, limit: 200 }).then(data => {
      this.playlists = data.data.playlists;
      this.loading = false;
    });
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss">
#detailContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  z-index: 110;
  background-color: #fff;

  .van-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
  }

  .navbar {
    z-index: 1;
  }

  .playlists {
    margin-top: 46px;
    padding: 0 10px;
  }

  .van-row--flex {
    flex-wrap: wrap;
  }

  .playlist-item {
    margin-bottom: 10px;
  }
}
</style>