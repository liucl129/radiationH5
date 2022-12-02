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
            <uni-data-select
              v-model="formData.fsybm"
              :localdata="range"
              @change="change"
              :clear="false"
            >
            </uni-data-select>
          </uni-forms-item>

          <uni-forms-item label="源类型:">
            <uni-title type="h6" :title="detail.fsylb"></uni-title>
          </uni-forms-item>
          <!-- <uni-forms-item label="巡检设备编号:">
            <uni-title type="h6" :title="detail.sbbh"></uni-title>
          </uni-forms-item> -->
          <uni-forms-item label="辐射剂量率:">
            <uni-easyinput v-model="formData.fsjl" placeholder="请输入" />
          </uni-forms-item>
          <uni-forms-item label="巡检照片:">
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
    <view class="ok-btn d-flex-item d-flex-center" @click="startClick('baseForm')">
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
      // 基础表单数据
      baseFormData: {
        name: "",
        age: "",
        introduction: "",
        sex: 0,
        datetimesingle: 1627529992399,
        value: "",
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
      form: {
        kczt: 0,
        sfkyd: 1,
        pageNo: 1,
        pageSize: 10,
      },
      formData:{
        fsyxh:"",
        fsjl:"",
        jd:"",
        wd:"",
        dd:"",
        fileJsonArr:"",
        ckbh:"",
      },
      detail:{}
    };
  },
  computed: {},
  onLoad() {
    this.form.ssyqbh = this.$DataStore.localGet("enterpriseCode");
    this.get();
    this.newDate = this.$Common.getDate();
  },
  onReady() {},
  methods: {
    get() {
      this.$Net.post(this.$api.storageOutSoucesList,{}, 1).then((res) => {
        console.log(res.data, "--------放射源查詢");
        res.data.forEach((element) => {
          this.range.push({
            value: element.fsyxh,
            text: element.fsybm,
          });
        });
        this.list = res.data;
      });
    },
    startClick(ref) {
      this.$refs[ref]
        .validate()
        .then((res) => {
          console.log("success", JSON.parse(res.fileJsonArr));
          
          
          // return;
          this.$Net.post(this.$api.saveStartWork,this.formData,1).then(res=>{
            this.$Jump.Back(1)
          })
          // uni.showToast({
          //   title: `校验通过`,
          // });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    change(e) {
      this.list.map((el, i) => {
        if (e == el.fsyxh) {
          this.detail = el;
          this.formData.ckbh = el.ckbh;
          this.formData.fsyxh = el.fsyxh;
        }
      });
    },
    changeImgs(imgArr) {
      // imgArr.forEach((element) => {
      //   this.imgData.push(element.pre + element.name);
      // });
      console.log("上传图片",imgArr)
      this.formData.fileJsonArr = JSON.stringify(imgArr);
    },
    getMap() {
      let _this = this;
      uni.chooseLocation({
        type: "gcj02",
        success: function (res) {
            //  console.log("位置名称：" + res.name);
            // console.log("详细地址：" + res.address);
          _this.formData.dd = res.address;
          _this.formData.jd = res.longitude;
          _this.formData.wd = res.latitude;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/startJob.scss";
</style>
