<template>
  <div id="navbar">
      <div class="title">{{title}}</div>
      <van-icon name="arrow-left" class="icon" @click="clickLeft" />
  </div>
</template>

<script>
export default {
    name:'NavBar',
    props:{
        title:String
    },
    methods:{
        clickLeft(){
            this.$emit('click-left')
        }
    }
};
</script>

<style lang="scss">
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 46px;
  background-color: white;

  .title{
      width:100%;
      height: 100%;
      line-height: 46px;
      text-align: center;
      font-size: 14px;
  }

  .icon{
      position: absolute;
      left:10px;
      top:50%;
      transform: translateY(-50%);
  }



  .van-nav-bar {
    i {
      color: black;
    }
  }
}
</style>