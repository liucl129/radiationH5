<template>
  <view class="early-feedback">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">预警信息</p>
      <ul>
        <li>预警时间:</li>
        <li>{{ warnInfo.yjsjStr }}</li>
      </ul>
      <ul>
        <li>预警说明:</li>
        <li>{{ warnInfo.yjnr }}</li>
      </ul>
    </view>
    <view class="details-head">
      <p class="d-flex-item d-flex-center">放射源信息</p>
      <ul>
        <li>放射源编码:</li>
        <li>{{ sourceInfo.fsybm }}</li>
      </ul>
      <ul>
        <li>放射源类别:</li>
        <li>{{ sourceInfo.fsylb }}</li>
      </ul>
      <ul>
        <li>放射源用途:</li>
        <li>{{ sourceInfo.fsyyt }}</li>
      </ul>
      <ul>
        <li>核素名称:</li>
        <li>{{ sourceInfo.hsmc }}</li>
      </ul>
      <ul>
        <li>生产厂家:</li>
        <li>{{ sourceInfo.sccj }}</li>
      </ul>
    </view>
    <view class="details-head" v-if="formType == 0">
      <p class="d-flex-item d-flex-center">预警自查确认</p>
      <ul>
        <li>是否异常:</li>
        <li class="radio">
          <uni-data-checkbox v-model="form.sfyc" :localdata="sexs" />
        </li>
      </ul>
      <ul>
        <li><span>*</span> 自查说明:</li>
        <li>
          <textarea
            class="textarea"
            v-model="form.zcsm"
            placeholder-style="color:#AEAEAE"
            placeholder="在此输入自查说明内容"
          />
        </li>
      </ul>
      <ul>
        <li><span>*</span>检查照片:</li>
        <li>
          <uploadFile @changeImgs="changeImgs"></uploadFile>
        </li>
      </ul>
      <ul>
        <li><span>*</span>定位:</li>
        <li>
          <view class="location d-flex-item d-space-between" >
            <span>{{ form.jd }} {{ form.wd }}</span>
            <image
              src="../../static/img/coordinate-icon@2x.png"
              mode=""
            ></image>
          </view>
        </li>
      </ul>
    </view>
    <view class="details-head" v-else>
      <p class="d-flex-item d-flex-center">预警自查确认</p>
      <ul>
        <li>是否异常:</li>
        <li class="radio">
          <uni-data-checkbox
            v-model="form.sfyc"
            :localdata="sexs"
            :disabled="disabled"
          />
        </li>
      </ul>
      <ul>
        <li><span>*</span> 自查说明:</li>
        <li>
          <textarea
            class="textarea"
            v-model="form.zcsm"
            placeholder-style="color:#AEAEAE"
            placeholder="在此输入自查说明内容"
            :disabled="disabled"
          />
        </li>
      </ul>
      <ul>
        <li><span>*</span>检查照片:</li>
        <li>
          <!-- <uploadFile :imgData="imgData" v-if="arrImglength"></uploadFile> -->
          <image
            class="early-feedback-img"
            :src="item.path"
            v-for="(item, i) in imgData"
            :key="i"
            @click="openImg(imgData, i)"
          ></image>
        </li>
      </ul>
      <ul>
        <li><span>*</span>定位:</li>
        <li>
          <view class="location d-flex-item d-space-between">
            <span>{{ form.jd }} {{ form.wd }}</span>
            <image
              src="../../static/img/coordinate-icon@2x.png"
              mode=""
            ></image>
          </view>
        </li>
      </ul>
    </view>
    <view
      class="ok-btn d-flex-item d-flex-center"
      v-if="formType == 0"
      @click="upExamination"
    >
      确认
    </view>
  </view>
</template>

<script>
import uploadFile from "../../components/upload-file/index.vue";
export default {
  components: {
    uploadFile,
  },
  data() {
    return {
      disabled: true,
      current: 0,
      sourceInfo: {},
      warnInfo: {},
      form: {
        sfyc: 1,
        zcsm: "",
        fileJsonArr: "",
        jd: "",
        wd: "",
        yjxxbh: "",
      },
      // 单选数据源
      sexs: [
        {
          text: "是",
          value: 1,
        },
        {
          text: "否",
          value: 2,
        },
      ],
      formType: "",
      imgData: [],
    };
  },
  computed: {
    arrImglength: function () {
      return this.imgData.length > 0 ? true : false;
    },
  },
  onLoad(opstion) {
    let _this= this
    this.form.yjxxbh = opstion.yjxxbh;
    this.formType = opstion.type;
    this.getDatail(opstion);
    uni.getLocation({
      type: "gcj02",
      isHighAccuracy: true, //开启高精度定位默认false
      success: function (res) {
        console.log("当前坐标", res);
        // console.log('经度:',that.lng,'纬度:',that.lat);//开发者工具打印的不准，这里需要真机测试查看经纬度
         _this.form.jd = res.longitude;
          _this.form.wd = res.latitude;
      },
    });
  },
  methods: {
    getDatail(val) {
      this.$Net
        .get(
          this.$api.earlyWarningDetail,
          {
            yjxxbh: val.yjxxbh,
          },
          1
        )
        .then((res) => {
          console.log(res.data, "预警详情");
          this.sourceInfo = res.data.sourceInfo;
          this.warnInfo = res.data.warnInfo;
          this.imgData = res.data.imgs;
          // res.data.imgs.forEach((element) => {
          //   this.imgData.push(element.pre + element.data);
          // });
          if (this.formType == 1) {
            this.form.sfyc =
              res.data.warnInfo.sfyc === "0"
                ? ""
                : res.data.warnInfo.sfyc === "1"
                ? 1
                : 2;
            this.form.zcsm = res.data.warnInfo.zcsm;
            this.form.jd = res.data.warnInfo.jd;
            this.form.wd = res.data.warnInfo.wd;
            this.form.zcsm = res.data.warnInfo.zcsm;
          }
          // this.form.sfyc = 2;
          // console.log(parseInt(res.data.warnInfo.sfyc))
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
    getMap() {
      let _this = this;
      uni.chooseLocation({
        type: "gcj02",
        success: function (res) {
          console.log(res);
          // console.log("位置名称：" + res.name);
          // console.log("详细地址：" + res.address);
          console.log("纬度：" + res.latitude);
          console.log("经度：" + res.longitude);
          _this.form.jd = res.latitude;
          _this.form.wd = res.longitude;

        },
      });

     
    },
    changeImgs(imgArr) {
      // console.log(imgArr, "上成功的图片");
      // imgArr.forEach((element) => {
      //   this.imgData.push(element.pre + element.name);
      // });
      this.form.fileJsonArr = JSON.stringify(imgArr);
    },
    upExamination() {
      console.log(this.form);
      if (
        this.form.zcsm !== "" &&
        this.form.zcsm !== null &&
        this.form.fileJsonArr !== "" &&
        this.form.fileJsonArr !== null &&
        this.form.jd !== "" &&
        this.form.jd !== null &&
        this.form.wd !== "" &&
        this.form.wd !== null &&
        this.form.yjxxbh !== "" &&
        this.form.yjxxbh !== null
      ) {
        
        this.$Net.post(this.$api.saveCheckAdd, this.form, 1).then((res) => {
          console.log(res, "添加成功");
          this.$Jump.Back();
        });
      } else {
        this.$Common.showTips("请填写完整！");
      }
    },
    openImg(arrNew, key) {
      this.$Common.showImg(arrNew, key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/early-feedback.scss";
</style>
