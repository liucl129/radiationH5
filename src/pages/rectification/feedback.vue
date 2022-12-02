<template>
  <view class="early-feedback">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">基本信息</p>
      <ul>
        <li>放射源编码:</li>
        <li>{{ sourceInfo.fsybm }}</li>
      </ul>
      <ul>
        <li>核素名称:</li>
        <li>{{ sourceInfo.hsmc }}</li>
      </ul>
      <ul>
        <li>生产厂家:</li>
        <li>{{ sourceInfo.sccj }}</li>
      </ul>
      <ul>
        <li>放射源类型:</li>
        <li>{{ sourceInfo.fsylb }}</li>
      </ul>
      <ul>
        <li>放射源用途:</li>
        <li>{{ sourceInfo.fsyyt }}</li>
      </ul>
      <ul>
        <li>整改类型:</li>
        <li>{{ warnRectify.zglx }}</li>
      </ul>
      <ul>
        <li>整改内容:</li>
        <li>
          <view class="rectification-content">
            <li>{{ warnRectify.zgnr }}</li>
            <li @click="openImg(detail.imgs, i)">
              <image
                :src="item.path"
                class=""
                v-for="(item, i) in detail.imgs"
                :key="i"
                mode=""
              ></image>
            </li>
          </view>
        </li>
      </ul>
      <ul>
        <li><span>*</span> 整改反馈:</li>
        <li>
          <span>{{ warnRectify.zgfk }}</span>
          <textarea
            v-if="warnRectify.zgzt == 0"
            class="textarea"
            placeholder-style="color:#F76260"
            placeholder="在此输入整改内容"
            v-model="form.zgfk"
          />
          <span v-else>{{ warnRectify.zgfk }}</span>
        </li>
      </ul>
      <ul>
        <li><span>*</span>整改照片:</li>
        <li v-if="warnRectify.zgzt == 0">
          <uploadFile @changeImgs="changeImgs"></uploadFile>
        </li>
        <li v-else>
          <view class="rectification-content">
            <li>
              <image
                :src="item.path"
                v-for="(item, i) in detail.zgimgs"
                :key="i"
                @click="openImg(detail.zgimgs, i)"
              ></image>
            </li>
          </view>
        </li>
      </ul>

      <ul class="location-ul">
        <li><span>*</span>定位:</li>
        <li>
          <view
            class="location d-flex-item d-space-between"
            @click="getMap"
            v-if="warnRectify.zgzt == 0"
          >
            <span>{{ form.jd }} {{ form.wd }}</span>
            <image
              src="../../static/img/coordinate-icon@2x.png"
              mode=""
            ></image>
          </view>
          <view class="location d-flex-item d-space-between" v-else>
            <span>{{ warnRectify.jd }} {{ warnRectify.wd }}</span>
            <image
              src="../../static/img/coordinate-icon@2x.png"
              mode=""
            ></image>
          </view>
        </li>
      </ul>
      <ul v-if="warnRectify.zgzt == 1">
        <li>整改结果:</li>
        <li>
          {{
            warnRectify.shzt
              ? warnRectify.shzt == 0
                ? "通过"
                : "未通过"
              : "未审核"
          }}
        </li>
      </ul>
      <ul v-if="warnRectify.zgzt == 1 && warnRectify.shzt == 1">
        <li>未通过原因:</li>
        <li>{{ warnRectify.shsm }}</li>
      </ul>
    </view>
    <view
      class="ok-btn d-flex-item d-flex-center"
      @click="upOk"
      v-if="warnRectify.zgzt == 0"
    >
      整改完成
    </view>
  </view>
</template>

<script>
import uploadFile from "../../components/upload-file/index.vue";
export default {
  components: { uploadFile },
  data() {
    return {
      items: [
        {
          value: "1",
          name: "是",
          checked: "true",
        },
        {
          value: "2",
          name: "否",
          checked: "false",
        },
      ],
      current: 0,
      form: {
        jd: "",
        wd: "",
        zgfk: "",
        zgbh: "",
        fileJsonArr: "",
      },
      sourceInfo: {},
      warnInfo: {},
      warnRectify: {},
      detail: {},
    };
  },
  onLoad(options) {
    this.getDetail(options);
  },
  methods: {
    getDetail(value) {
      this.$Net.post(this.$api.getRectifyInfo, value, 1).then((res) => {
        this.detail = res.data;
        this.sourceInfo = res.data.sourceInfo;
        this.warnInfo = res.data.warnInfo;
        this.warnRectify = res.data.warnRectify;
      });
    },
    radioChange: function (evt) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].value === evt.detail.value) {
          this.current = i;
          break;
        }
      }
    },
    changeImgs(imgArr) {
      //   imgArr.forEach((element) => {
      //     this.imgData.push(element.pre + element.name);
      //   });
      console.log(imgArr, "上传图片");
      this.form.fileJsonArr = JSON.stringify(imgArr);
    },
    getMap() {
      let _this = this;
      uni.chooseLocation({
        type: "gcj02",
        success: function (res) {
          _this.form.jd = res.longitude;
          _this.form.wd = res.latitude;
        },
      });
    },
    upOk() {
      if (
        (this.form.fileJsonArr ==
          "" || this.form.zgfk == "" || this.form.jd == "")
      ) {
        // console.log(this.form);
        this.$Common.showTips("请补充完整");
      } else {
        this.form.zgbh = this.warnRectify.zgbh;
        this.$Net.post(this.$api.saveRectifyFeek, this.form, 1).then((res) => {
          console.log(this.form, "提交表单");
          this.$Jump.Back(1);
        });
      }
    },
    openImg(url, key) {
      this.$Common.showImg(url, key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/rectificationFeedback.scss";
</style>
