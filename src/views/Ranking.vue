<template>
  <div id="rankingContainer" class="container">
    <NavBar :title="'排行榜'" @click-left="()=>{this.$router.go(-1)}"></NavBar>
    <p class="ranking-title" :style="{marginTop:'46px'}">官方榜</p>
    <ul class="official-ranking-box">
      <li
        class="ranking-item"
        v-for="(item,index) in officialList"
        :key="item.name+index"
        :data-id="item.id"
        @click="()=>{$router.push({name:'SonglistDetail',params:{id:item.id}})}"
      >
        <van-image class="cover-img" :src="item.coverImgUrl" lazy-load />
        <div class="tracks">
          <p
            class="tracks-item van-ellipsis"
            v-for="(value,ind) in item.tracks"
            :key="ind"
          >{{ind+1}}.{{value.first}} - {{value.second}}</p>
        </div>
      </li>
    </ul>
    <p class="ranking-title" :style="{marginTop:'10px'}">推荐榜</p>
    <ul class="recommend-ranking-box" :style="{paddingBottom:'50px'}">
      <li
        class="ranking-item"
        v-for="(item,index) in recommendList"
        :key="item.name+index"
        :data-id="item.id"
        @click="()=>{$router.push({name:'SonglistDetail',params:{id:item.id}})}"
      >
        <van-image class="cover-img" :src="item.coverImgUrl" lazy-load />
        <p class="name van-multi-ellipsis--l2">{{item.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { api_getTopList, api_getListDetail } from "../api";
import NavBar from "../components/NavBar";

export default {
  data() {
    return {
      officialList: [], //官方榜
      recommendList: [] //推荐榜
    };
  },
  components: {
    NavBar
  },
  created() {
    api_getListDetail().then(result => {
      let list = result.data.list;
      list.forEach(item => {
        if (item.tracks.length > 0) {
          this.officialList.push({
            id: item.id,
            name: item.name,
            coverImgUrl: item.coverImgUrl,
            tracks: item.tracks
          });
        } else {
          this.recommendList.push({
            id: item.id,
            name: item.name,
            coverImgUrl: item.coverImgUrl
          });
        }
      });
    });
  }
};
</script>

<style lang="scss">
#rankingContainer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #fff;
  overflow-y: auto;

  .ranking-title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }

  .cover-img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  .official-ranking-box {
    width: 100%;
    padding: 0 10px;

    .ranking-item {
      display: flex;
      width: 100%;
      margin: 10px 0;
    }

    .tracks {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 60%;
      margin-left: 20px;
    }

    .tracks-item {
      margin: 10px 0;
      color: rgb(80, 79, 79);
    }
  }

  .recommend-ranking-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 10px;

    .ranking-item {
      width: 30%;
      margin-bottom: 10px;
    }
  }
}
</style>