<template>
  <view class="login-content">
    <view class="head">
      <view class="head-one-title">欢迎登录辐射卫士 </view>
      <view class="head-two-title">企业信息一网打尽 </view>
    </view>
    <view class="login-conter">
      <view class="login-title">登录</view>
      <form>
        <view class="uni-form-item uni-column">
          <input
            class="uni-input"
            name="input"
            @input="inputChang"
            v-model="valiFormData.username"
            placeholder="请输入账号"
          />
          <view class="in-tips" v-show="showInput">账号不能为空</view>
          <image src="../../static/img/login-user@2x.png"></image>
        </view>
        <!-- <view class="uni-form-item uni-column">
          <input class="uni-input" name="input" :password="true" placeholder="请输入密码" />
          <view class="in-tips" v-show="showInput">密码不能为空</view>
          <image src="../../static/img/login-pwd@2x.png"></image>
        </view> -->
        <button type="primary" :loading="loading" class="login-btn" @click="submit(valiFormData)">
          登录
        </button>
      </form>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showInput: false,
      valiFormData: { username: "" },
      loading:false
    };
  },
  onLoad() {
    let height = uni.getSystemInfoSync().statusBarHeight;
    console.log(height);
  },
  methods: {
    inputChang(el) {
      console.log(el.detail.value);
      if (el.detail.value) {
        this.showInput = false;
      } else {
        this.showInput = true;
      }
    },
    submit(ref) {
      if (ref.username) {
        this.loading=true
        this.$Net.post(this.$api.login, this.valiFormData, 1, 0).then((res) => {
          if (res.code == 200) {
            this.loading=false
            this.$DataStore.localSet("moveToken", res.data.accessToken);
            uni.redirectTo({
              url: "/pages/index/index",
            });
          }
        });
      } else {
        this.showInput = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  width: 750rpx;
  padding: 0;
  background-color: #f7f8fd;
}

.login-content {
  width: 746rpx;
  height: 100vh;
  background: url(../../static/img/login-bg@2x.png);
  background-repeat: no-repeat;
  background-size: 100%;
  position: relative;
  .head {
    position: absolute;
    top: 10%;
    padding: 32rpx;
    .head-one-title {
      font-size: 56rpx;
      font-weight: 600;
      color: #ffffff;
    }
    .head-two-title {
      font-size: 30rpx;
      font-weight: 400;
      color: rgb(255, 255, 255, 0.3);
      margin-top: 34rpx;
    }
  }
  .login-conter {
    width: 550rpx;
    height: 776rpx;
    background: #ffffff;
    box-shadow: 0px 4rpx 30rpx 0px rgba(46, 111, 240, 0.26);
    border-radius: 16rpx;

    position: absolute;
    top: 50%;
    left: 50%;
    margin: auto;
    transform: translate(-50%, -30%);
    padding: 60rpx;
    .login-title {
      font-size: 42rpx;
      font-weight: 600;
      color: #333333;
    }
    .form-item {
      display: flex;
      align-items: center;
    }
    .uni-form-item {
      width: 100%;
      position: relative;
      margin-top: 120rpx;
      image {
        width: 34rpx;
        height: 38rpx;
        position: absolute;
        left: 52rpx;
        top: 24rpx;
      }
      .in-tips {
        font-size: 24rpx;
        color: #ff0000;
        margin-left: 100rpx;
      }
    }
    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 84rpx;
      background: linear-gradient(311deg, #2e6ff0 0%, #83acff 100%);
      box-shadow: 0px 16rpx 18rpx -2rpx rgba(46, 111, 240, 0.23);
      border-radius: 49rpx;
      margin: auto;
      margin-top: 220rpx;
    }
    .uni-input {
      width: 82%;
      height: 84rpx;
      border-radius: 49rpx;
      border: 1rpx solid #e5e5e5;
      padding-left: 50px;
    }
  }
}
</style>