<template>
  <view class="task">
    <view class="task-head d-flex-item d-space-between">
      <view class="early-warning-status d-flex-item d-space-between">
        <view
          class="early-warning-btn d-flex-item d-flex-center"
          :class="[activeIndex == i ? 'active' : '']"
          v-for="(item, i) in btns"
          :key="i"
          @click="statusClick(i)"
        >
          {{ item }}
        </view>
      </view>
      <searchBtn @changeBtn="changeBtn"></searchBtn>
    </view>
    <uni-datetime-picker
      class="search-model"
      v-if="searchShow"
      type="daterange"
      v-model="single"
      @change="changeDate"
    />
    <mescroll-uni
      :top="headTop"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="initCallback"
    >
      <!-- 列表 -->
      <view class="task-list body-padding">
        <sourceModel
          :data="data"
          :list="list"
          :color="true"
          @lookDetail="lookDetail"
          :stutasFalse="true"
          :tips="false"
        />
      </view>
    </mescroll-uni>
    <view class="ok-btn d-flex-item d-flex-center" @click="startClick()">
      添加作业
    </view>
  </view>
</template>

<script>
import searchBtn from "../../components/search-btn/index.vue";
import searchModel from "../../components/search-model/index.vue";
import sourceModel from "@/components/source-model";
export default {
  components: { searchBtn, searchModel, sourceModel },
  data() {
    return {
       activeIndex: 0,
      btns: ["进行中作业", "已完成作业"],
      searchShow: false,
      data: [
        {
          key: "放射源编码",
          value: "fsybm",
        },
        {
          key: "作业地点",
          value: "dd",
        },
        {
          key: "开始时间",
          value: "kszysj",
        },
        {
          key: "结束时间",
          value: "jszysj",
        },
        {
          key: "剂量率",
          value: "fsjl",
        },
      ],
      list: [],
      range: [],
      form: {
        pageNo: 1,
        pageSize: 20,
        type:0
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
      headTop: 115,
    };
  },
  onLoad() {},
  onShow() {
    this.getList();
  },
  methods: {
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
      this.$Net.post(this.$api.getWorkPage, this.form, 0).then((res) => {
        if (res.records == 0) {
          //从第几条开始
          mescroll.endByPage(0, 0);
          return false;
        }
        if (pageNum == 1) this.list = [];
         this.list = this.list.concat(res.data.records)
         console.log(res.data.records)
        this.mescroll.endBySize(res.data.records.length, res.data.total);
      });
    },
    changeBtn() {
      this.searchShow = !this.searchShow;
      if (this.searchShow) {
        this.headTop = 185;
      } else {
        this.headTop = 115;
      }
    },
    lookDetail(value) {
      if (value.jszysj) {
        this.go("/pages/task/endJob?kszybh=" + value.kszybh + "&type=1");
      } else {
        this.go("/pages/task/endJob?kszybh=" + value.kszybh + "&type=2");
      }
    },
    startClick() {
      this.go("/pages/task/startJob");
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    changeDate(value) {
      if (value.length > 0) {
        this.form.kssj = value[0];
        this.form.jssj = value[1];
      } else {
        this.$delete(this.form, "kssj");
        this.$delete(this.form, "jssj");
      }
      this.getList();
    },
    statusClick(i) {
      this.activeIndex = i;
      // return
      this.form.type = i;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.task {
  padding-bottom: 100rpx;
  .task-head {
    height: 88rpx;
    margin-bottom: 18rpx;
    .task-head-text {
      font-size: 28rpx;
      font-weight: 600;
      color: #2c2c2c;
    }
  }
  ::v-deep .uni-date-x {
    height: 30px;
  }
  .task-list {
    margin-top: 22rpx;
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
.early-warning-status {
  width: 65%;
  .early-warning-btn {
    width: 206rpx;
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
::v-deep .uni-date-x {
  height: 20px;
}
.search-model{
  // margin-top: 20rpx;
}
</style>