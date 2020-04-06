<template>
  <div id="login-page">
    <van-nav-bar :border="false" :right-text="switchIndex==0?'注册':'登录'" @click-right="onClickRight" />
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
      mode="out-in"
    >
      <!-- 登录框 -->
      <div class="login-box" v-if="switchIndex==0" key="login">
        <van-row style="marginTop:100px">
          <van-col span="20" offset="2">
            <van-field
              v-model="login_phone"
              placeholder="请输入手机号"
              label="+ 86"
              label-align="center"
            />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-divider :style="{margin:0}" />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-field
              v-model="login_password"
              type="password"
              placeholder="请输入密码"
              label=" "
              label-align="center"
            />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-divider :style="{margin:0}" />
          </van-col>
        </van-row>
        <van-row class="forget-pwd-btn">
          <van-col span="4" offset="19">忘记密码</van-col>
        </van-row>
        <van-row class="login-btn">
          <van-col span="20" offset="2">
            <van-button
              round
              size="large"
              color="linear-gradient(to right, #4bb0ff, #6149f6)"
              @click="login"
            >登录</van-button>
          </van-col>
        </van-row>
      </div>

      <!-- 注册框 -->
      <div class="register-box" v-else key="register">
        <van-row style="marginTop:100px">
          <van-col span="20" offset="2">
            <van-field
              v-model="register_phone"
              placeholder="请输入手机号"
              label="+ 86"
              label-align="center"
            />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-divider :style="{margin:0}" />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="15" offset="2">
            <van-field
              v-model="register_captcha"
              placeholder="请输入验证码"
              label=" "
              label-align="center"
            />
          </van-col>
          <van-col span="7">
            <van-button
              type="primary"
              size="normal"
              :disabled="heightLightCaptcha"
              @click="getCaptcha"
              style="width:102px"
            >{{captchaButtonText}}</van-button>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-divider :style="{margin:0}" />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-field
              v-model="register_password"
              type="password"
              placeholder="请输入密码"
              label=" "
              label-align="center"
            />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-divider :style="{margin:0}" />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="20" offset="2">
            <van-field
              v-model="register_nickname"
              placeholder="请输入昵称"
              label=" "
              label-align="center"
            />
          </van-col>
        </van-row>
        <van-row class="login-btn">
          <van-col span="20" offset="2">
            <van-button
              round
              :disabled="heightLight"
              size="large"
              color="linear-gradient(to right, #4bb0ff, #6149f6)"
              @click="register"
            >注册</van-button>
          </van-col>
        </van-row>
      </div>
    </transition>
  </div>
</template>

<script>
import { api_register, api_getCaptcha } from "../api/index";
import { isEmpty, checkPhone } from "../lib/utils";

let flag = true;//用来辅助判断是否禁用 获取验证码按钮

export default {
  name:'Login',
  data() {
    return {
      switchIndex: 0, //0:登录  1:注册
      login_phone: "",
      login_password: "",
      register_nickname: "",
      register_phone: "",
      register_password: "",
      register_captcha: "",
      heightLightCaptcha: true, //验证码按钮高亮控制
      heightLight: true, //注册按钮高亮控制
      captchaButtonText: "获取验证码"
    };
  },
  watch: {
    register_phone(newVal, oldVal) {
      //控制 注册 按钮高亮
      if (!isEmpty(newVal)&& checkPhone(newVal)) {
        this.heightLight = false;
      } else {
        this.heightLight = true;
      }
      //控制验证码按钮高亮
      if (!isEmpty(newVal) && checkPhone(newVal) && flag) {
        this.heightLightCaptcha = false;
      } else {
        this.heightLightCaptcha = true;
      }
    }
  },
  methods: {
    //点击右上角按钮，切换 注册和登录界面
    onClickRight() {
      this.switchIndex = this.switchIndex === 0 ? 1 : 0;
    },
    //登录
    login() {
      this.$store.dispatch("login", {
        phone: this.login_phone,
        password: this.login_password,
        vue: this
      });

      this.$ls.set("phone", this.login_phone);
      this.$ls.set("password", this.login_password);
    },
    //注册
    register() {
      if (
        !isEmpty(this.register_phone) &&
        !isEmpty(this.register_captcha) &&
        !isEmpty(this.register_password) &&
        !isEmpty(this.register_nickname)
      ) {
        flag = true;
        api_register({
          phone: this.register_phone,
          password: this.register_password,
          nickname: this.register_nickname,
          captcha: this.register_captcha
        })
          .then(result => {
            if (result.data.code === 200) {
              this.$toast("注册成功！");
            } else {
              this.$toast("注册失败！");
            }
          })
          .catch(err => {
            console.log("注册出错！！！", err);
          });
      }
    },
    //获取验证码
    getCaptcha() {
      flag = false;
      this.heightLightCaptcha = true;
      let count = 30;
      //点击后倒计时，count 秒后才能再次点击
      let timer = setInterval(() => {
        if (count === 1) {
          clearInterval(timer);
          this.heightLightCaptcha = false;
          this.captchaButtonText = "获取验证码";
        } else {
          count--;
          this.captchaButtonText = count + "s";
        }
      }, 1000);
      api_getCaptcha({ phone: this.register_phone })
        .then(result => {
          if (result.data.code !== 200) {
            this.$toast("获取验证码失败！");
          } else {
            this.$ls.set("phone", this.login_phone);
            this.$ls.set("password", this.login_password);
            this.$router.push('/')
          }
        })
        .catch(err => {
          console.log("获取验证码出错==>", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../public/scss/base";
#login-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  z-index: 300;

  .van-nav-bar__text {
    color: $baseGray;
  }

  .forget-pwd-btn {
    margin-top: 10px;
    color: $baseGray;
  }

  .login-btn {
    margin-top: 30px;
  }
}
</style>