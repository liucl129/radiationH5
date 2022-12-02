<template>
  <view class="upload-file-container">
    <view class="upload-img-center" v-for="(item, i) in arrImg" :key="i">
      <image
        v-if="item.path"
        :src="item.path"
        @click="lookImg(item, i)"
        mode=""
      ></image>
      <image v-else :src="item" @click="lookImg(item, i)" mode=""></image>
      <view class="img-del" @click="dleImg(item, i)">
        <image src="../../static/img/img_del_icon.png" mode=""></image>
      </view>
    </view>
    <view class="upload-file-center" v-if="arrImglength < limit" @click="upImg">
      <image src="../../static/img/upload-icon.png"></image>
      <view class="upload-text"> 上传 </view>
    </view>
  </view>
</template>

<script>
import Base_url from "../../utils/config";
export default {
  props: {
    // 带有默认值的数字
    limit: {
      type: [Number, String],
      default: 1,
    },
    imgList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      arrImg: [],
      arrImgFile: [],
      newdata: {},
    };
  },
  watch: {
    imgList: {
      handler(newVal, oldVal) {
        this.arrImg = newVal;
      },
      immediate: true,
      // 这里是关键，代表递归监听 demo 的变化
      deep: true,
    },
  },
  computed: {
    arrImglength: function () {
      return this.arrImg.length;
    },
  },
  created() {
    console.log();
  },
  methods: {
    upImg() {
      uni.chooseImage({
        count: 6,
        sizeType: ["original", "compressed"],
        // sourceType: ["camera","album"],
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.$nextTick(() => {
            this.arrImg.push(tempFilePaths[0]);
          });
          uni.uploadFile({
            url: this.$baseUrl.BASE_URL + "/common/uploadFiles", //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: "files",
            formData: {
              fileName: "fileName",
            },
            header: {
              Authorization: this.$DataStore.localGet("moveToken"),
            },
            success: (data) => {
              console.log(data, "上传图片");
              if (data.statusCode === 200) {
                this.newdata = JSON.parse(data.data).data[0];

                if (this.arrImgFile.length != 0) {
                  this.arrImgFile = this.arrImgFile.concat(this.newdata);
                } else {
                  this.arrImgFile = [];
                  this.arrImgFile.push(this.newdata);
                }
                this.$emit("changeImgs", this.arrImgFile);
              }else{
                uni.showToast("上传失败")
                this.arrImg.pop()
              }
            },
            fail: (eorr) => {
              console.log(eorr, "失败回调");
            },
          });
        },
      });
    },
    dleImg(item, i) {
      this.arrImg = "";
    },
    lookImg(url) {
      // console.log(e,"放大的时候")
      uni.previewImage({
        urls: this.arrImg,
        current: url,
      });
    },
    dleImg(item, index) {
      console.log(item, index, "删除的时候");
      uni.showModal({
        title: "温馨提示!",
        content: "确定要删除吗？",
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            this.arrImg.splice(index, 1);
            this.$emit("changeImgs", this.arrImgFile.splice(index, 1));
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-file-container {
  display: flex;
  flex-flow: row wrap;

  .upload-img-center {
    // display: flex;
    // flex-flow: row wrap;
    position: relative;
    image {
      width: 140rpx;
      height: 112rpx;
      margin: 6rpx;
    }
    .img-del {
      // width: 30rpx;
      // height: 30rpx;
      position: absolute;
      right: 0;
      top: 0;
      // background: #000;
      image {
        width: 30rpx;
        height: 30rpx;
      }
    }
  }

  .upload-file-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140rpx;
    height: 112rpx;
    background: rgba(227, 227, 227, 0.2);
    border-radius: 8rpx;
    border: 2rpx dashed #e3e3e3;
    flex-flow: column;
    text-align: center;

    image {
      width: 32rpx;
      height: 32rpx;
    }

    .upload-text {
      font-size: 20rpx;
      font-weight: 500;
      color: #666666;
    }
  }
}
</style>
