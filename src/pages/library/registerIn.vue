<template>
  <view class="library-register">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">基本信息</p>
      <view class="example">
        <!-- 基础用法，不包含校验规则 -->
        <uni-forms
          ref="formData"
          :modelValue="formData"
          :label-align="labelAlign"
          :label-width="labelWidth"
        >
          <uni-forms-item label="放射源编码:">
            <uni-title type="h6" :title="sourceInfo.fsybm"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="核元素名称:">
            <uni-title type="h6" :title="sourceInfo.hsmc"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="生产厂家:">
            <uni-title type="h6" :title="sourceInfo.sccj"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="放射源类别:">
            <uni-title type="h6" :title="sourceInfo.fsylb"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="放射源用途:">
            <uni-title type="h6" :title="sourceInfo.fsyyt"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="剂量率:">
            <uni-easyinput v-model="formData.jll" placeholder="请输入" />
          </uni-forms-item>
          <!-- <uni-forms-item label="送贮单位:">
            <uni-easyinput v-model="formData.szdw" placeholder="请输入" />
          </uni-forms-item>
          <uni-forms-item label="联系人:">
            <uni-easyinput v-model="formData.zclxr" placeholder="请输入" />
          </uni-forms-item>
          <uni-forms-item label="联系方式:">
            <uni-easyinput v-model="formData.zclxfs" placeholder="请输入" />
          </uni-forms-item> -->
          <uni-forms-item label="入库照片:">
            <uploadFile @changeImgs="changeImgs"></uploadFile>
          </uni-forms-item>
          <uni-forms-item label="定位:">
            <view class="location d-flex-item d-space-between" @click="getMap">
              <span>{{ formData.jd }} {{ formData.wd }}</span>
              <image
                src="../../static/img/coordinate-icon@2x.png"
                mode=""
              ></image>
            </view>
          </uni-forms-item>
        </uni-forms>
      </view>
    </view>
    <view
      class="ok-btn d-flex-item d-flex-center"
      @click="startClick('formData')"
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
      labelWidth: "95",
      range: [],
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
      // 基础表单数据
      formData: {
        ckbh: "",
        jll: "",
        szdw: "",
        zclxr: "",
        zclxfs: "",
        jd: "",
        wd: "",
        fileJsonArr: "",
        fsyxh: "", //放射源编号
      },
      list: [],
      detail: {},
      imgData: [],
      newDate: "",
      sourceInfo: {},
      form: {
        pageNo: 1,
        pageSize: 10,
        ssyqbh: "",
        sfkyd: "1",
      },
    };
  },
  computed: {},
  onLoad(opstion) {
    this.getDetails(opstion);
  },
  methods: {
    getDetails(value) {
      this.$Net.post(this.$api.getStorageInfo, value, 1).then((res) => {
        let newData = res.data;
        this.sourceInfo = newData.sourceInfo;
        this.formData.fsyxh = newData.sourceInfo.fsyxh;
        this.formData.ckbh = newData.storageOut.ckbh;
      });
    },
    startClick(ref) {
      this.$refs[ref]
        .validate()
        .then((res) => {
          console.log("success", res);
          this.$Net
            .post(this.$api.saveStorageIn, this.formData, 1)
            .then((res) => {
              this.$Jump.Back(1);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    change(e) {
      this.list.map((el, i) => {
        if (e == el.fsyxh) {
          this.detail = el;
        }
      });
    },
    changeImgs(imgArr) {
      imgArr.forEach((element) => {
        this.imgData.push(element.pre + element.name);
      });
      this.formData.fileJsonArr = JSON.stringify(imgArr);
    },
    getMap() {
      let _this = this;
      uni.chooseLocation({
        type: "gcj02",
        success: function (res) {
          _this.formData.jd = res.longitude;
          _this.formData.wd = res.latitude;
        },
      });
    },
    maskClick(e) {
      console.log("maskClick事件选择时间:", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/librayRegister.scss";
</style>
