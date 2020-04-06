<template>
  <div id="categoryContainer" class="container">
    <NavBar :title="'歌单广场'" @click-left="()=>{this.$router.go(-1)}"></NavBar>
    <van-icon name="apps-o" class="more-btn" @click="toggleCategoryBox(true)" />
    <van-tabs
      v-model="active"
      class="tab"
      @click="switchTab"
      :sticky="true"
      :offset-top="46"
      @rendered="renderedHandler"
    >
      <van-tab v-for="(tag,index) in hotTags" :key="'tab'+index" :title="tag.name">
        <div class="playlist-box" :class="'playlistbox'+index">
          <ul class="playlist-list">
            <li
              class="playlist-item"
              v-for="(item,ind) in playlist"
              :key="item.name+ind"
              @click="()=>{$router.push({name:'SonglistDetail',params:{id:item.id}})}"
            >
              <van-image class="cover-img" :src="item.coverImgUrl" lazy-load />
              <p class="name van-multi-ellipsis--l2">{{item.name}}</p>
            </li>
            <van-loading
              v-if="loading"
              size="24px"
              :style="{width:'100%',textAlign:'center'}"
            >加载中...</van-loading>
            <div v-if="showTips" :style="{width:'100%',textAlign:'center',color:'#969799'}">没有更多了...</div>
          </ul>
        </div>
      </van-tab>
    </van-tabs>

    <transition
      enter-active-class="animated slideInRight faster"
      leave-active-class="animated slideOutRight faster"
      mode="out-in"
    >
      <div id="categoryBox" v-show="showCategoryBox">
        <NavBar :title="'分类'" @click-left="toggleCategoryBox(false)"></NavBar>
        <div class="category-wrapper">
          <div class="category-item" v-for="(item,index) in categoryList" :key="index">
            <van-row>
              <van-col span="4" offset="1" class="name">{{item.name}}</van-col>
            </van-row>
            <van-row>
              <van-col offset="1" v-for="(tag,ind) in item.tags" :key="tag+ind" class="tag">
                <van-tag round :data-tag="tag" @click="()=>{$router.push({name:'DetailByTag',params:{tag}})}">{{tag}}</van-tag>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  api_getCategory,
  api_getHotCategory,
  api_getPlayListByCategory
} from "../api";
import BScroll from "better-scroll";
import NavBar from "../components/NavBar";
import { getStyle } from "../lib/utils";

export default {
  name: "Category",
  data() {
    return {
      active: 0,
      loading: true,
      // showTips:false,
      //所有分类
      allCategory: {},
      //所有标签
      allTags: [{ name: "" }],
      //tab显示热门歌单分类标签
      hotTags: [],
      //默认请求30条数据
      limit: 30,
      playlist: [],
      currtentTitle: "推荐",
      //保存已经点击过的标签，已经点击过的，不用重新请求，并记住点击过的滚动的位置，0是默认显示的，所以默认当作是点击过的
      //同时保存相关信息，如标签索引，当前加载数据量，当前滚动距离，当前数据
      isActived: [
        {
          index: 0, //当前标签索引，等同 active
          limit: 30, //显示的数据条数，默认30条，如果上拉加载则增加，要小于limit
          y: 0, //滚动的y距离
          data: [], //当前标签页的数据
          counts: 120, //数据总条数，
          scroll: null, //当前标签页的bscroll实例
          cat: "全部" //当前标签页请求参数，推荐页默认请求全部
        }
      ],
      showCategoryBox: false
    };
  },
  components: {
    NavBar
  },
  computed: {
    showTips() {
      for (let i = 0, len = this.isActived.length; i < len; i++) {
        if (this.isActived[i].index == this.active) {
          return (
            this.isActived[i].limit == this.isActived[i].counts && !this.loading
          );
        }
      }
      return false;
    },
    categoryList() {
      /**
       *  allCategory是一个对象，键名是数字，有5个键名 0，1，2，3，4
       *  构造以下格式的数据
       * [
       *    {
       *      name:类型名
       *      tags:[标签数组]
       *    },
       *    {
       *      name:类型名
       *      tags:[标签数组]
       *    }
       * ]
       */
      if (this.allTags.length > 0) {
        let list = [];
        let counts = Object.keys(this.allCategory).length;
        let index = 0;
        for (let i = 0; i < counts; i++) {
          let name = this.allCategory[i];
          let tags = [];
          for (let j = 0, len = this.allTags.length; j < len; j++) {
            if (this.allTags[j].category == i) {
              tags.push(this.allTags[j].name);
            }
          }
          list.push({ name,tags });
        }
        return list;
      }
      return []
    }
  },
  created() {
    this.getData();
  },
  watch: {
    //监听标签页切换，每次切换保存上一页的 y 滚动距离
    active(newValue, oldValue) {
      if (newValue != oldValue) {
        for (let i = 0, len = this.isActived.length; i < len; i++) {
          if (this.isActived[i].index == oldValue) {
            this.isActived[i].y = this.isActived[i].scroll.y;
            break;
          }
        }
      }
    },

  },
  methods: {
    getData() {
      this.axios
        .all([
          api_getCategory(),
          api_getHotCategory(),
          api_getPlayListByCategory({
            limit: this.limit,
            cat: "全部"
          })
        ])
        .then(
          this.axios.spread((categoryData, hotCategoryData, playlistData) => {
            // 所有请求现在都执行完成
            this.loading = false;

            this.allCategory = categoryData.data.categories;
            this.allTags = categoryData.data.sub;
            this.hotTags = hotCategoryData.data.tags;
            this.hotTags.unshift({ name: "推荐" });
            this.playlist = playlistData.data.playlists;

            for (let i = 0, len = this.isActived.length; i < len; i++) {
              if (this.isActived[i].index == 0) {
                this.isActived[i].data = playlistData.data.playlists;
                // this.isActived[i].counts = playlistData.data.total;
                break;
              }
            }
          })
        );
    },
    switchTab(name, title) {
      //点击的是当前标签，直接返回
      if (this.currtentTitle == title) {
        return;
      }
      this.currtentTitle = title;

      //判断是否已经被点击过
      let flag = false;
      let index = null;
      for (let i = 0, len = this.isActived.length; i < len; i++) {
        if (this.isActived[i].index == this.active) {
          flag = true;
          index = i;
          break;
        }
      }
      if (flag) {
        //如果不是第一次进入，获取之前保存的数据，并恢复之前滚动位置
        this.playlist = this.isActived[index].data;
        this.$nextTick(() => {
          this.isActived[index].scroll.refresh();
          this.isActived[index].scroll.scrollTo(0, this.isActived[index].y);
        });
      } else {
        //如果是第一次进入该标签，则初始化相关数据，并默认请求30条数据
        let info = {
          index: this.active,
          limit: 30,
          data: [],
          counts: 120,
          y: 0,
          scroll: null,
          cat: ""
        };
        this.isActived.push(info);

        //根据当前标签请求数据
        api_getPlayListByCategory({
          limit: this.limit,
          cat: title
        }).then(data => {
          this.playlist = data.data.playlists;

          for (let i = 0, len = this.isActived.length; i < len; i++) {
            if (this.isActived[i].index == this.active) {
              //保存相关信息
              // this.isActived[i].counts = data.data.total;
              this.isActived[i].data = data.data.playlists;
              this.isActived[i].cat = title;
            }
          }
        });
      }
    },
    //每个标签栏第一次渲染完毕时触发
    renderedHandler() {
      //为每个tab页的playlist设置固定高度，因为需要用到betterScroll,容器必须有明确的高度
      this.$nextTick(() => {
        var navbarHeight = getStyle("#navbar", "height");

        var tabHeight = getStyle(".van-tabs__wrap", "height");

        var tabbarHeight = getStyle(".tabbar", "height");

        var height =
          document.body.offsetHeight - navbarHeight - tabHeight - tabbarHeight;

        document.querySelector(".playlistbox" + this.active).style.height =
          height + "px";
      });
      for (let i = 0, len = this.isActived.length; i < len; i++) {
        if (this.isActived[i].index == this.active) {
          if (this.isActived[i] && !this.isActived[i].scroll) {
            //初始化bscroll实例，并保存
            this.isActived[i].scroll = new BScroll(
              document.querySelector(".playlistbox" + this.active),
              {
                scrollY: true,
                click: true,
                probeType: 3,
                useTransition: false, // 防止iphone微信滑动卡顿
                //下拉刷新：可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
                //这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载
                pullUpLoad: {
                  threshold: 20
                }
              }
            );

            //监听上拉加载事件
            this.isActived[i].scroll.on("pullingUp", () => {
              //只有当前数据条数小于总条数才进行请求

              if (this.isActived[i].limit < this.isActived[i].counts) {
                this.loading = true;

                //每次请求累加 30
                let number = this.isActived[i].limit + this.limit;

                //如果超过总条数，则设置为总条数，否则就是当前条数加30
                this.isActived[i].limit =
                  number > this.isActived[i].counts
                    ? this.isActived[i].counts
                    : number;

                api_getPlayListByCategory({
                  limit: this.isActived[i].limit,
                  cat: this.isActived[i].cat
                }).then(data => {
                  this.loading = false;
                  this.playlist = data.data.playlists;
                  this.isActived[i].data = data.data.playlists;
                  this.isActived[i].scroll.finishPullUp();
                });
              }

              //告诉 bscroll 结束一次上拉刷新事件
              this.isActived[i].scroll.finishPullUp(); //可以多次执行上拉刷新
            });
          }
        }
      }
    },
    toggleCategoryBox(flag) {
      this.showCategoryBox = flag;
      if (flag) {
        document.querySelector("#categoryContainer").style.zIndex = "110";
      } else {
        document.querySelector("#categoryContainer").style.zIndex = "100";
      }
    }
  }
};
</script>

<style lang="scss">
#categoryContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 100;
  overflow-y: auto;

  .more-btn {
    position: absolute;
    top: 60px;
    right: 10px;
    font-size: 16px;
    z-index: 1;
  }

  .van-tabs__wrap {
    width: 90%;
  }

  .tab {
    margin-top: 46px;
  }

  .playlist-box {
    width: 100%;
    // height: 550px;
    margin-top: 10px;
    overflow: hidden;
  }

  .playlist-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    padding-bottom: 50px;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    justify-content: space-between;

    .playlist-item {
      width: 100px;
      margin-bottom: 10px;
    }

    .cover-img {
      width: 100px;
      height: 100px;
    }

    .name {
      width: 100%;
    }
  }

  #categoryBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
    z-index: 300;

    .category-wrapper {
      margin-top: 46px;
    }

    .category-item{
      margin: 10px 0;

      .van-tag{
        display: block;
        width:65px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background-color:rgb(202, 198, 198);
        white-space: nowrap;
        color:black;
      }
    }

    .tag{
      margin-top: 10px;
      margin-bottom: 10px;
    }


    .name {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>