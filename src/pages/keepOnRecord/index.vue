<template>
  <view class="keep-on-record">
    <view class="keep-on-head d-flex-item d-space-between">
      <view class="keep-on-head-status d-flex-item d-space-between">
        <view
          class="keep-on-head-btn d-flex-item d-flex-center"
          :class="[activeIndex == i ? 'active' : '']"
          v-for="(item, i) in btns"
          :key="i"
          @click="statusClick(i)"
        >
          {{ item }}
        </view>
      </view>
      <view class="model-select">
        <searchBtn @changeBtn="changeBtn"></searchBtn>
      </view>
    </view>
    <uni-datetime-picker
      class="search-model"
      v-if="searchShow"
      type="daterange"
      v-model="single"
      @change="changeDate"
    />
    <!-- 列表 -->
    <mescroll-uni
      :top="headTop"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="initCallback"
    >
      <view class="keep-on-list body-padding" v-if="activeIndex==0">
        <sourceModel
          :data="data"
          :list="list"
          name="查看"
          :color="true"
          @lookDetail="lookDetail"
          :tips="false"
        />
      </view>
      <view class="keep-on-list body-padding" v-if="activeIndex==1">
        <sourceModel
          :data="dataRecord"
          :list="listRecord"
          name="查看"
          :color="true"
          @lookDetail="startClick"
          :tips="false"
        />
      </view>
    </mescroll-uni>
    <view class="ok-btn d-flex-item d-flex-center" @click="startClick">
      添加{{activeIndex==1?"备案":"报备"}}
    </view>
  </view>
</template>

<script>
import searchBtn from "../../components/search-btn/index.vue";
import searchModel from "../../components/search-model/index.vue";
import sourceModel from "@/components/source-model";
export default {
  components: {
    searchBtn,
    searchModel,
    sourceModel,
  },
  data() {
    return {
      searchShow:false,
      activeIndex: 0,
      btns: ["巡检报备"],
      // ,"备案信息"
      value: "",
      timeNum: "",
      data: [
        {
          key: "报备时间",
          value: "bbsj",
        },
        {
          key: "报备数量",
          value: "sourcenum",
        },
      ],
      list: [],
      dataRecord:[
        {
          key: "备案时间",
          value: "bbsj",
        },
        {
          key: "备案编号",
          value: "bnbh",
        },
        {
          key: "备案类型",
          value: "bnlx",
        }
      ],
      listRecord:[{bbsj:"111",bnbh:"222",bnlx:"333"},{bbsj:"111",bnbh:"222",bnlx:"333"},{bbsj:"111",bnbh:"222",bnlx:"333"},{bbsj:"111",bnbh:"222",bnlx:"333"},{bbsj:"111",bnbh:"222",bnlx:"333"}],
      form: {
        pageNo: 1,
        pageSize: 10,
      },
      // 下拉上拉
      numList: [],
      mescroll: null, //实例
      upOption: {
        use: true, // 是否启用上拉加载; 默认true
        auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10, // 每页数据的数量,默认10 （这是在后台配置的）
        },
        noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
        empty: {
          tip: "暂无相关数据",
        },
        id: "",
      },
      downOption: {
        use: true, // 是否启用下拉刷新; 默认true
        auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
      },
      headTop: 80,
    };
  },
  onLoad() {
    this.getList();
  },
  onShow(){
      this.getList();
  },
  methods: {
    getSelect() {
      this.$Net.post(this.$api.warnCofigCtrList, this.form).then((res) => {
        console.log(res, "预警配置222");
      });
    },
    getList() {
      if (this.mescroll != null) this.mescroll.resetUpScroll();
    },
    // 下拉分页
    downCallback(mescroll) {
      this.mescroll.resetUpScroll();
    },
    // 列表内容
    initCallback(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(mescroll) {
      let pageNum = mescroll.num; // 页码, 默认从1开始
      let pageSize = mescroll.size; // 页长, 默认每页10条
      this.form.pageNo = pageNum;
      this.form.pageSize = pageSize;
      this.$Net.post(this.$api.patrolReportCtrGet, this.form, 0).then((res) => {
        if (res.records == 0) {
          //从第几条开始
          mescroll.endByPage(0, 0);
          return false;
        }
        if (pageNum == 1) this.list = [];
        this.list = this.list.concat(res.data.records)
        this.mescroll.endBySize(res.data.records.length, res.data.total);
      });
    },
    lookDetail(value) {
      console.log("点击查看",value)
      // return;
      this.go("/pages/keepOnRecord/details?bbbh=" + value.bbbh);
    },
    startClick() {
      // return
      this.go("/pages/keepOnRecord/addReporting");
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    changeBtn() {
      this.searchShow = !this.searchShow;
      if (this.searchShow) {
        this.headTop = 165;
      } else {
        this.headTop = 115;
      }
    },
    changeDate(e) {
      console.log(e);
      if (e.length > 0) {
        this.form.bbkssj = e[0];
        this.form.bbjssj = e[1];
      } else {
        this.$delete(this.form, "bbkssj");
        this.$delete(this.form, "bbjssj");
      }
      this.getList();
    },
    bnlookDetail(){
      // this.go("/pages/keepOnRecord/details?bbbh=" + value.bbbh);
    },
    statusClick(i) {
      this.activeIndex = i;
      // return
      // this.form.type = i;
    },
  },
};
</script>

<style lang="scss" scoped>
.keep-on-record {
  padding-bottom: 100rpx;
 ::v-deep .uni-date-x {
      height: 30px;
    }
  .keep-on-head {
    .keep-on-head-status {
      width: 50%;
      .keep-on-head-btn {
        width: 156rpx;
        height: 56rpx;
        border-radius: 37rpx;
        box-shadow: 0px 4rpx 8rpx 4rpx rgba(240, 240, 240, 0.3);
        font-size: 28rpx;
        font-weight: 600;
        color: $uni-secondary-color;
        background: #ffffff;
        border: 2rpx solid rgba(46, 111, 240, 0);
      }

      .active {
        color: $uni-primary;
        background: rgba(46, 111, 240, 0.04);
        box-shadow: 0px 4rpx 8rpx 4rpx rgba(71, 95, 180, 0.03);
        border: 2rpx solid rgba(46, 111, 240, 0.5);
      }
    }
   
    .model-select {
      ::v-deep .uni-date-x {
        height: 30px;
      }
      ::v-deep .uni-date__icon-clear {
        right: -6px;
        border: 4px solid transparent;
      }
      ::v-deep .uni-stat__select {
        padding: 0;
        background-color: #ffffff;
      }

      ::v-deep .uni-select {
        width: 222rpx;
        height: 56rpx;
        border-radius: $uni-border-radius;
        border: 2rpx solid #e3e3e3;
        text-align: center;
      }

      ::v-deep .uni-stat__actived {
        outline: 1px solid #ffffff;
      }

      ::v-deep .uni-select__input-box {
        width: 132rpx !important;
      }
    }
  }

  .search-model {
    margin-top: 22rpx;
  }

  .keep-on-list {
    margin-top: 32rpx;
  }
  .ok-btn {
    width: 686rpx;
    height: 84rpx;
    background: #2e6ff0;
    border-radius: 42rpx;
    margin: 0 auto;
    margin-top: 112rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: $uni-white;
    position: fixed;
    bottom: 36rpx;
    z-index: 10;
  }
}
</style>
