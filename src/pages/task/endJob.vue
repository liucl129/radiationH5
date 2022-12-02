<template>
  <view class="inspection-details">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">基本信息</p>
      <view class="example">
        <!-- 基础用法，不包含校验规则 -->
        <uni-forms
          ref="baseForm"
          :modelValue="formData"
          :label-align="labelAlign"
          :label-width="labelWidth"
        >
          <uni-forms-item label="源编码:">
            <uni-title type="h6" :title="details.fsybm"></uni-title>
          </uni-forms-item>

          <uni-forms-item label="源类型:">
            <uni-title type="h6" :title="details.fsylb"></uni-title>
          </uni-forms-item>
          <!-- <uni-forms-item label="巡检设备编号:">
            <uni-title type="h6" :title="details.sbbh"></uni-title>
          </uni-forms-item> -->
          <uni-forms-item label="开始作业时间:">
            <uni-title type="h6" :title="details.kszysj"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="开始作业剂量率:">
            <uni-title type="h6" :title="details.fsjl"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="开始作业图片:">
            <image
              :src="item.path"
              mode=""
              v-for="(item, i) in details.imgMapList"
              class="start-img"
              :key="i"
              @click="showImg(details.imgMapList, i)"
            ></image>
          </uni-forms-item>
          <view v-if="type==1">
            <uni-forms-item label="辐射剂量率:">
              <uni-title type="h6" :title="details.jsfsjl"></uni-title>
            </uni-forms-item>
            <uni-forms-item label="巡检照片:">
              <image
                :src="item.path"
                v-for="(item, i) in details.jsImgMapList"
                class="start-img"
                :key="i"
                @click="showImg(details.jsImgMapList, i)"
              ></image>
            </uni-forms-item>
            <uni-forms-item label="定位:">
              <view class="location d-flex-item d-space-between">
                <span>{{ formData.jd }} {{ formData.wd }}</span>
                <image
                  src="../../static/img/coordinate-icon@2x.png"
                  mode=""
                ></image>
              </view>
            </uni-forms-item>
          </view>
          <view v-else>
            <uni-forms-item label="辐射剂量率:">
              <uni-easyinput v-model="formData.fsjl" placeholder="请输入" />
            </uni-forms-item>
            <uni-forms-item label="巡检照片:">
              <uploadFile @changeImgs="changeImgs" :limit="2"></uploadFile>
            </uni-forms-item>
            <uni-forms-item label="定位:">
              <view
                class="location d-flex-item d-space-between"
                @click="getMap"
              >
                <span>{{ formData.jd }} {{ formData.wd }}</span>
                <image
                  src="../../static/img/coordinate-icon@2x.png"
                  mode=""
                ></image>
              </view>
            </uni-forms-item>
          </view>
        </uni-forms>
      </view>
    </view>
    <view
      class="ok-btn d-flex-item d-flex-center"
      @click="startClick('baseForm')"
      v-if="type==2"
    >
      确认
    </view>
  </view>
</template>

<script>
import uploadFile from "../../components/upload-file/index.vue";
export default {
  components: { uploadFile },
  data() {
    return {
      labelAlign: "right",
      labelWidth: "110",
      // 基础表单数据
      formData: {
        jd: "",
        wd: "",
        dd: "",
        fsjl: "",
        kszybh: "",
        fileJsonArr: "",
      },
      // 校验表单数据
      valiFormData: {
        name: "",
        age: "",
        introduction: "",
      },
      // 校验规则
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: "姓名不能为空",
            },
          ],
        },
        age: {
          rules: [
            {
              required: true,
              errorMessage: "年龄不能为空",
            },
            {
              format: "number",
              errorMessage: "年龄只能输入数字",
            },
          ],
        },
      },
      // 自定义表单数据
      customFormData: {
        name: "",
        age: "",
      },
      // 自定义表单校验规则
      customRules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: "姓名不能为空",
            },
          ],
        },
        age: {
          rules: [
            {
              required: true,
              errorMessage: "年龄不能为空",
            },
          ],
        },
      },
      details: {},
    };
  },
  computed: {},
  onLoad(opstion) {
    this.type=opstion.type
    this.getDetails(opstion);
  },
  onReady() {},
  methods: {
    getDetails(opstion) {
      this.$Net.post(this.$api.getWorkInfo, {'kszybh':opstion.kszybh}, 1).then((res) => {
        this.details = res.data;
        this.formData.kszybh = res.data.kszybh;
        this.formData.jd = res.data.jd;
        this.formData.wd = res.data.wd;
        this.formData.dd = res.data.dd;
        this.$Jump.upTitle( this.type==1 ? "作业详情" : "结束作业");
      });
    },
    startClick(ref) {

      this.$refs[ref]
        .validate()
        .then((res) => {
          // console.log("success", res);
          // return;
          this.$Net
            .post(this.$api.saveEndWork, this.formData, 1)
            .then((res) => {
              this.$Jump.Back(1);
            });
          //   uni.showToast({
          //     title: `校验通过`,
          //   });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    change() {},
    changeImgs(imgArr) {
      // imgArr.forEach((element) => {
      //   this.imgData.push(element.pre + element.name);
      // });
      // console.log("上传图片",imgArr)
      this.formData.fileJsonArr = JSON.stringify(imgArr);
    },
    getMap() {
      let _this = this;
      uni.chooseLocation({
        type: "gcj02",
        success: function (res) {
          _this.formData.dd = res.address;
          _this.formData.jd = res.longitude;
          _this.formData.wd = res.latitude;
        },
      });
    },
    showImg(arr, key) {
      this.$Common.showImg(arr, key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/startJob.scss";
.start-img {
  width: 140rpx;
  height: 112rpx;
  border-radius: 8rpx;
  margin: 6rpx;
}
</style>
