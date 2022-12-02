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
          <uni-forms-item label="类型选择:">
            <uni-data-checkbox v-model="type" :localdata="sexs" />
          </uni-forms-item>
          <uni-forms-item label="选择放射源:" v-show="type == 0">
            <uni-data-select
              v-model="formDatavalue"
              :localdata="range"
              :search="searchBoolean"
              @change="change"
              @input="input"
              :clear="false"
            >
            </uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="选择设备:" v-show="type == 1">
            <uni-data-select
              v-model="formData.sbbh"
              :localdata="rangeEquipment"
              :search="searchBoolean"
              @change="changeEquipment"
              :clear="false"
            >
            </uni-data-select>
          </uni-forms-item>

          <uni-forms-item label="源类别:" v-show="type == 0">
            <uni-title type="h6" :title="detail.fsylb"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="上次检测剂量:" v-show="type == 0">
            <uni-title type="h6" :title="detail.scjl"></uni-title>
          </uni-forms-item>
          <uni-forms-item label="辐射剂量率:">
            <uni-easyinput v-model="formData.fsz" placeholder="请输入" />
          </uni-forms-item>
          <uni-forms-item label="检查照片:">
            <uploadFile @changeImgs="changeImgs" :limit="3"></uploadFile>
          </uni-forms-item>
          <uni-forms-item label="定位:">
            <!-- <uni-easyinput v-model="formData.name" placeholder="请选择"  /> -->
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
      searchBoolean:true,
      // imgList:[{path:"https://s2.loli.net/2022/06/01/PZnC2DLGsUAkmNK.png"}],
      labelAlign: "right",
      labelWidth: "95",
      range: [],
      rangeEquipment: [],
      // 基础表单数据
      type: 0,
      formDatavalue: "",
      formData: {
        fsyxh: "",
        fsylb: "",
        fsz: "",
        jd: "",
        wd: "",
        sbbh: "",
        fileJsonArr: "",
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
        pageSize: 60,
        ssyqbh: "",
      },
      detail: {},
    };
  },
  computed: {},
  // watch:{
  //   // type(newNum,oldNum){
  //   //   console.log(newNum,oldNum)
  //   //   if(newNum==1){
  //   //        this.getEquipment();
  //   //   }
  //   // }
  // },
  onLoad() {
    this.form.ssyqbh = this.$DataStore.localGet("enterpriseCode");
    this.newDate = this.$Common.getDate();
    this.getEquipment();
    this.get('');
  },
  onReady() {},
  methods: {
    getEquipment() {
      this.$Net
        .post(this.$api.getSourceEquipPageByMobile, this.form, 1)
        .then((res) => {
          res.data.records.forEach((element) => {
            this.rangeEquipment.push({
              value: element.sbbh,
              text: element.sbmc,
            });
          });
          // console.log(this.rangeEquipment, "设备数组");
        });
    },
    get(radioactiveSourceNo) {
      this.range=[]
      this.$Net
        .post(this.$api.sourceGet, { ...this.form, sfbb: 1,radioactiveSourceNo }, 1)
        .then((res) => {
          let arr = res.data.list.map((element) => {
            return {
              value: element.fsyxh,
              text: element.fsybm,
            };
          });
          // this.range = this.range.concat(arr);  //合并数组
          // let arrNew= new Set(this.range); //通过set集合去重
          // this.range=Array.from(arrNew);
            this.list = res.data.list;
            // 
            this.range.push(...arr)
              console.log(this.range,'合并数组')
            // this.$nextTick(()=>{
            //   this.range = this.range.concat(arr);  //合并数组
            
            // })
        });
    },
    getLv(val) {
      this.$Net.post(this.$api.viewLastValue, val, 1).then((res) => {
        console.log(res.data, "上次场景");
        // this.detail.scjl= res.data
        this.$set(this.detail, "scjl", res.data);
      });
    },
    startClick(ref) {
      this.$refs[ref]
        .validate()
        .then((res) => {
          console.log("success", this.formData);
          //   uni.showToast({
          //     title: `校验通过`,
          //   });
          console.log(this.formData, "提交表单", this.detail);
          if (this.type == 1) {
            console.log("11111111111");
          } else {
            console.log("000000000000000");
            this.formData.fsyxh = this.detail.fsyxh;
            this.formData.fsylb = this.detail.fsylb;
            // this.formData.sbbh = this.detail.sbbh;
          }
          // return
          this.$Net
            .post(this.$api.PatrolInfoCtrAdd, this.formData, 1)
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
          let form = {
            fsyxh: el.fsyxh,
            sbh: el.sbh,
          };
          this.getLv(form);
        }
      });
      // this.searchBoolean=false
    },
    input(e) {
      console.log(e, "***---");
      this.get(e);
      // this.ppp();
    },
    ppp() {
      // console.log("ppppppppppp");
    },
    changeEquipment(e) {},
    changeImgs(imgArr) {
      //   imgArr.forEach((element) => {
      //     this.imgData.push(element.pre + element.name);
      //   });
      // console.log(imgArr, "接受组件传的值");
      this.formData.fileJsonArr = JSON.stringify(imgArr);
    },
    getMap() {
      let _this = this;
      uni.chooseLocation({
        type: "gcj02",
        success: function (res) {
          _this.formData.jd = res.longitude;
          _this.formData.wd = res.latitude;
          //     console.log("位置名称：" + res.name);
          //   console.log("详细地址：" + res.address);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/inspectionBackups.scss";
</style>
