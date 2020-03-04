<template>
  <!-- 弹出层 -->
  <div class="popup" ref="popup">
    <div class="bgCover" ref="bgCover">
      <img class="blurImage" :src="detailData.coverImgUrl" ref="blurImage"/>
    </div>
    <van-row class="icon" type="flex" justify="end" @click="hidePopup">
      <van-col>
        <van-icon name="close" />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col>
        <img :src="detailData.coverImgUrl" class="coverImg" />
      </van-col>
    </van-row>
    <van-row class="name" type="flex" justify="center" align="center">
      <van-col>{{detailData.name}}</van-col>
    </van-row>
    <div class="divider">
      <van-divider />
    </div>
    <van-row class="tag" type="flex">
      <van-col>
        <span>标签：</span>

        <van-tag
          round
          class="tag-name"
          v-for="(item,index) in detailData.tags"
          :key="index"
        >{{item}}</van-tag>
      </van-col>
    </van-row>
    <van-row class="description" type="flex" justify="center">
      <van-col>{{filterArrow(detailData.description)}}</van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  props: ["detailData"],
  data() {
    return {};
  },
  methods: {
    //过滤掉特殊符号
    filterArrow(value) {
      return value.replace(/>|<|—|＜/g, "");
    },
    //隐藏弹出框
    hidePopup() {
      this.$emit("hidePopup", false);
    }
  }
};
</script>

<style lang="scss">
// 弹出层
.popup {
  .icon {
    margin-top: 10px;
    margin-right: 20px;

    i {
      font-size: 30px;
      color: white;
    }
  }

  .coverImg {
    width: 150px;
    height: 150px;
  }

  .name {
    font-size: 18px;
  }

  .divider {
    display: flex;
    justify-content: center;

    .van-divider {
      width: 90%;
    }
  }

  .tag {
    padding: 0 5px;
    .tag-name{
      font-size: 14px;
    }
    .van-tag {
      margin: 0 5px;
    }
  }

  .tag,
  .description {
    margin-left: 20px;
    font-size: 16px;
  }

  .description {
    height: 350px;
    margin-top: 15px;
    padding: 0 5px;
    overflow-y: auto;
  }

  //背景模糊
  .bgCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    z-index: -1;

    .blurImage {
      width: 100%;
      height: auto;
      filter: blur(15px) brightness(70%);
      transform: scale(3);
      z-index: 0;
    }
  }
}
</style>