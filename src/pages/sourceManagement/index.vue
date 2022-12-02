<template>
  <view class="sourceManagement">
    <view class="source-head">
      <view class="source-head-text">
        <view class="source-head-text-one d-flex-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongsi"></use>
          </svg>
          <p>当前公司</p>
        </view>
        <view class="source-head-text-two">
          {{ info.qymc }}
        </view>
        <view class="source-head-text-three">
          <span>证书编号：</span><span>{{ info.qyxh }}</span>
        </view>
      </view>
    </view>
    <view class="source-conter d-flex d-space-between">
      <view
        class="source-conter-model"
        :class="[index == 0 ? 'black-mobile' : 'black-mobile1']"
        
        @click="mobileFixed(0)"
      >
        <p>放射源</p>
        <p>{{ numSource }}</p>
      </view>
      <view
        class="source-conter-model"
        :class="[index == 1 ? 'black-fixed' : 'black-fixed1']"
        
        @click="mobileFixed(1)"
      >
        <p>设备信息</p>
        <p>{{ numEquipment }}</p>
      </view>
    </view>
    <view class="source-list">
      <sourceModel
        :data="data"
        :list="list"
        name="详情"
        :color="true"
        @lookDetail="lookDetail"
        :tips="false"
      />
    </view>
  </view>
</template>

<script>
import sourceModel from "@/components/source-model";
export default {
  components: { sourceModel },
  data() {
    return {
      data: [
        {
          key: "源编码",
          value: "fsybm",
        },
        {
          key: "类别",
          value: "fsylb",
        },
        {
          key: "放射性类型",
          value: "status",
        },
        {
          key: "放射源状态",
          value: "zt",
        },
      ],
      list: [],
      info: {},
      Mobile: [],
      fixed: [],
      index: 0,
      code: "",
      numSource: "",
      numEquipment: "",
      formList:{
        pageNo:1,
        pageSize:9999
      }
    };
  },
  created() {
    this.infoGet();
    this.code = this.$DataStore.localGet("enterpriseCode");
    this.getSource();
    this.getEquipment();
  },
  methods: {
    lookDetail(value) {
      console.log(value, "当前行数据");
      if (this.index == 0) {
        this.go("/pages/sourceManagement/details?fsyxh=" + value.fsyxh);
      } else {
        this.go("/pages/index/equipment?sbbh="  + value.sbbh);
      }
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    mobileFixed(val) {
      this.index = val;
      if (val == 1) {
        this.data = [
          // {
          //   key: "设备编号",
          //   value: "sbbh",
          // },
          {
            key: "设备名称",
            value: "sbmc",
          },
          {
            key: "放射源数量",
            value: "num",
          },
        ];
        this.getEquipment();
      } else {
        this.data = [
          {
            key: "源编码",
            value: "fsybm",
          },
          {
            key: "类别",
            value: "fsylb",
          },
          {
            key: "放射性类型",
            value: "status",
          },
          {
            key: "放射源状态",
            value: "zt",
          },
        ];
        this.getSource();
      }
    },
	// 企业信息
    infoGet() {
      this.$Net.post(this.$api.enterpriseInfoGet, this.form, 1).then((res) => {
        let newdata = res.data;
        this.info = newdata;
      });
    },
    //放射源查詢
    getSource() {
      this.$Net
        .post(this.$api.sourceGet, { ssyqbh: this.code,...this.formList }, 1)
        .then((res) => {
          this.list = res.data.list;
          this.numSource = res.data.total;
          this.list.map((item, i) => {
            if (item.sfkyd == 0) {
              this.$set(item, "status", "固定");
            } else if (item.sfkyd == 1) {
              this.$set(item, "status", "移动");
            } else if (item.sfkyd == null) {
              this.$set(item, "status", "");
            }
          });
        });
    },
    //设备
    getEquipment() {
      this.$Net
        .post(this.$api.getSourceEquipPageByMobile, { ssyqbh: this.code,...this.formList }, 1)
        .then((res) => {
          if (this.index == 1) {
            this.list = res.data.records;
          }
          this.numEquipment = res.data.total;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/sourceManagement.scss";
</style>