<template>
  <view class="source-management-details">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">基本信息</p>
      <ul>
        <li>放射源编码:</li>
        <li>{{ information.fsybm ? information.fsybm : "暂无" }}</li>
      </ul>
      <ul>
        <li>核素名称:</li>
        <li>{{ information.hsmc ? information.hsmc : "暂无" }}</li>
      </ul>
      <ul>
        <li>生产厂家:</li>
        <li>{{ information.sccj ? information.sccj : "暂无" }}</li>
      </ul>
      <ul>
        <li>放射源类别:</li>
        <li>{{ information.fsylb ? information.fsylb : "暂无" }}</li>
      </ul>
      <ul>
        <li>放射源用途:</li>
        <li>{{ information.fsyyt ? information.fsyyt : "暂无" }}</li>
      </ul>
      <ul>
        <li>出厂时间:</li>
        <li>{{ information.ccrq ? information.ccrq : "暂无" }}</li>
      </ul>
      <ul>
        <li>出厂活度:</li>
        <li>{{ information.cchd ? information.cchd : "暂无" }}</li>
      </ul>
      <ul>
        <li>所属单位:</li>
        <li>{{ information.ssqymc ? information.ssqymc : "暂无" }}</li>
      </ul>
      <ul>
        <li>许可证号:</li>
        <li>{{ information.syxk ? information.syxk : "暂无" }}</li>
      </ul>
      <ul>
        <li>放射源照片:</li>
        <li
          @click="openImg(require('../../static/img/fixed-source-2-bg@2x.png'))"
          v-if="information.fsyzp"
        >
          <image
            v-for="(item, i) in information.fsyzp"
            :key="i"
            :src="item"
            mode=""
          ></image>
        </li>
      </ul>
    </view>
    <view class="details-table">
      <p>巡检记录</p>
      <tableModel
        :title="patrolTitle"
        :table="patrolTable"
        operation="详情"
        @lookDetail="inspectionLook"
      />
    </view>
    <view class="details-table"  v-if="dwlx==1">
      <p>出入库记录</p>
      <tableModel
        :title="inAndOutTitle"
        :table="inAndOutTable"
        operation="详情"
        @lookDetail="libraryLook"
      />
    </view>
    <view class="details-table" v-if="dwlx==1">
      <p>作业记录</p>
      <tableModel
        :title="taskTitle"
        :table="taskTable"
        operation="详情"
        @lookDetail="taskLook"
      />
    </view>
  </view>
</template>

<script>
import tableModel from "./components/index.vue";
export default {
  components: {
    tableModel,
  },
  data() {
    return {
      arr: [],
      information: {},
      patrolTitle: [
        {
          key: "巡检时间",
          value: "sbsjStr",
        },
        {
          key: "巡检人员",
          value: "xjrymc",
        },
        {
          key: "剂量状态",
          value: "status",
        },
      ],
      patrolTable: [],
      inAndOutTitle: [
        {
          key: "源编码",
          value: "fsybm",
        },
        {
          key: "出库时间",
          value: "cksj",
        },
        {
          key: "入库时间",
          value: "rksj",
        },
      ],
      inAndOutTable: [],
      taskTitle: [
        {
          key: "作业时间",
          value: "kszysj",
        },
        {
          key: "结束时间",
          value: "jszysj",
        },
      ],
      taskTable: [],
      dwlx:this.$DataStore.localGet("dwlx")
    };
  },
  onLoad(opstion) {
    this.getDetail(opstion);
  },
  methods: {
    openImg(url) {
      this.$Common.showImg(url);
    },
    getDetail(val) {
      this.$Net
        .get(this.$api.sourceInfo, { fsyxh: val.fsyxh }, 1)
        .then((res) => {
          console.log(res.data, "源详情");
          let newdata = res.data;
          this.information = newdata;

          newdata.patrolInfoDataList.forEach((item) => {
            if (item.zt == 1) {
              this.$set(item, "status", "正常");
            } else if (item.zt == 2) {
              this.$set(item, "status", "源丢失");
            } else if (item.zt == 3) {
              this.$set(item, "status", "入库");
            }
          });
          this.patrolTable = newdata.patrolInfoDataList;
          this.inAndOutTable = newdata.storageOutListList;
          this.taskTable = newdata.workStartList;
        });
    },
    inspectionLook(value) {
      console.log(value, "巡检记录");
      this.goTO("/pages/inspection/details?xh=" + value.xh);
    },
    libraryLook(value) {
      console.log(value, "出入库记录");
	//   return;
      this.goTO("/pages/library/details?ckxh=" + value.ckbh + "&rkbh=" + value.rkbh);
    },
    taskLook(value) {
      console.log(value, "作业记录");
	//   return;
      let url = "/pages/task/endJob?kszybh=" + value.kszybh + "&type=1";
      this.goTO(url);
    },
    goTO(url) {
      this.$Jump.Open(url);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/sourceManagementDetails.scss";
</style>
