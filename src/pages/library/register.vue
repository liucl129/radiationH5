<template>
  <view class="library-register">
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
          <uni-forms-item label="放射源编码:">
            <uni-data-select
              v-model="formData.fsyxh"
              :localdata="range"
              @change="change"
              :clear="false"
            >
            </uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="预计入库时间:">
            <!-- <uni-easyinput v-model="baseFormData.name" placeholder="请输入" /> -->
            <uni-datetime-picker
              type="datetime"
              :clear-icon="false"
              v-model="formData.yjrksjStr"
            />
            <!-- <uni-datetime-picker type="datetime" v-model="datetimesingle" @change="changeLog" /> -->
          </uni-forms-item>
          <uni-forms-item label="核元素名称:">
            <uni-title type="h6" :title="detail.hsmc"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="生产厂家:">
            <uni-title type="h6" :title="detail.sccj"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="放射源类别:">
            <uni-title type="h6" :title="detail.fsylb"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="放射源用途:">
            <uni-title type="h6" :title="detail.fsyyt"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="剂量率:">
            <uni-easyinput v-model="formData.jll" placeholder="请输入" />
          </uni-forms-item>
          <!-- <uni-forms-item label="使用单位:">
            <uni-easyinput v-model="formData.sydw" placeholder="请输入" />
          </uni-forms-item>
          <uni-forms-item label="联系人:">
            <uni-easyinput v-model="formData.lxr" placeholder="请输入" />
          </uni-forms-item>
          <uni-forms-item label="联系方式:">
            <uni-easyinput v-model="formData.lxfs" placeholder="请输入" />
          </uni-forms-item> -->
          <uni-forms-item label="出库照片:">
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
      @click="startClick('baseForm')"
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
      // 基础表单数据
      baseFormData: {
        name: "",
        age: "",
        introduction: "",
        sex: 0,
        datetimesingle: 1627529992399,
        value: "",
      },
      // 单选数据源
      sexs: [
        {
          text: "选择放射源",
          value: 0,
        },
        {
          text: "选择设备",
          value: 1,
        },
      ],
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
        pageNo: 1,
        pageSize: 10,
        ssyqbh: "",
        sfkyd: "1",
      },
      formData: {
        // ckbh: "",
        fsyxh: "",
        jll: "",
        // sydw: "",
        // lxr: "",
        // lxfs: "",
        jd: "",
        wd: "",
        yjrksjStr: "",
        // cksj: "",
        fileJsonArr: "",
      },
      list: [],
      detail: {},
      imgData: [],
      newDate: "",
    };
  },
  computed: {},
  onLoad() {
    this.get();
    this.form.ssyqbh = this.$DataStore.localGet("enterpriseCode");
    this.newDate = this.$Common.getDate('yyyy-mm-dd HH:mm:ss');
    // console.log(this.newDate,"----------------获取当前时间")
    this.formData.yjrksjStr= this.newDate
  },
  onReady() {},
  methods: {
    get() {
      this.$Net.post(this.$api.sourceGet, this.form, 1).then((res) => {
        // console.log(res.data.list, "--------放射源查詢");
        res.data.list.forEach((element) => {
          this.range.push({
            value: element.fsyxh,
            text: element.fsybm,
          });
        });
        this.list = res.data.list;
      });
    },
    startClick(ref) {
      this.$refs[ref]
        .validate()
        .then((res) => {
          console.log("success", this.formData);
          // return
          this.$Net
            .post(this.$api.saveStorageOut, this.formData, 1)
            .then((res) => {
              this.$Jump.Back(1);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    change(e) {
      // console.log(e,"选择放射源",this.formData)
      this.formData.fsyxh=e
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
          //   console.log("位置名称：" + res.name);
          //   console.log("详细地址：" + res.address);
          //   console.log("纬度：" + res.latitude);
          //   console.log("经度：" + res.longitude);
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
