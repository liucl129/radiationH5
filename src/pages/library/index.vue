<template>
  <view class="library">
    <view class="library-head d-flex-item d-space-between">
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
    <!-- <searchModel
      class="searchModel"
      v-if="searchShow"
      :range="range"
      @changeDate="changeDate"
      @changeSecle="changeSecle"
    ></searchModel> -->
    <!-- l列表 -->
    <mescroll-uni
      :top="headTop"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="initCallback"
    >
      <view class="library-list body-padding">
        <view class="library-list-model" v-for="(item, i) in numList" :key="i">
          <ul>
            <li>源编码:</li>
            <li>{{ item.fsybm }}</li>
          </ul>
          <view class="d-flex d-space-between out-time">
            <ul>
              <li>出库时间:</li>
              <li>{{ item.cksj }}</li>
            </ul>
            <ul>
              <li>入库时间:</li>
              <li>{{ item.rksj }}</li>
            </ul>
          </view>
          <view
            class="library-foot d-flex-item d-space-between"
            @click="lookDetail(item.rksj, item)"
          >
            <view class="library-foot-text">
              {{ item.rksj == "" ? "入库" : "详情" }}
            </view>
            <image src="../../static/svg/right-blue-icon.svg" alt="" />
          </view>
        </view>
      </view>
    </mescroll-uni>
    <view class="ok-btn d-flex-item d-flex-center" @click="startClick()">
      出库登记
    </view>
  </view>
</template>

<script>
import searchBtn from "../../components/search-btn/index.vue";
import searchModel from "../../components/search-model/index.vue";
export default {
  components: {
    searchBtn,
    searchModel,
  },
  data() {
    return {
      activeIndex: 0,
      btns: ["已出库", "已入库"],
      searchShow: false,
      range: [
        { value: "3", text: "全部" },
        { value: "0", text: "出库" },
        { value: "1", text: "入库" },
      ],
      list: [],
      form: {
        pageNo: 1,
        pageSize: 11,
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
      // this.$Net.post(this.$api.getStoragePage, this.form, 1).then((res) => {
      //   res.data.records.forEach((el) => {
      //     el.rksj = el.rksj.substring(0, el.rksj.length - 3);
      //     el.cksj = el.cksj.substring(0, el.cksj.length - 3);
      //   });
      //   this.list = res.data.records;
      //   console.log(this.list, "列表");
      // });
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
      this.$Net.post(this.$api.getStoragePage, this.form, 0).then((res) => {
        if (res.records == 0) {
          //从第几条开始
          mescroll.endByPage(0, 0);
          return false;
        }
        if (pageNum == 1) this.numList = [];
        res.data.records.forEach((el) => {
          el.rksj = el.rksj.substring(0, el.rksj.length - 3);
          el.cksj = el.cksj.substring(0, el.cksj.length - 3);
        });

        this.numList = this.numList.concat(res.data.records);
        this.mescroll.endBySize(res.data.records.length, res.data.total);
      });
    },
    changeBtn() {
      this.searchShow = !this.searchShow;
      if (this.searchShow) {
        this.headTop = 195;
      } else {
        this.headTop = 115;
      }
    },
    lookDetail(type, value) {
      console.log(type);
      let url =
        "/pages/library/details?ckxh=" + value.ckbh + "&rkbh=" + value.rkbh;
      if (type == "" || type == null) {
        console.log(type);
        url = "/pages/library/registerIn?ckxh=" + value.ckbh;
      }
      this.go(url);
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    startClick() {
      this.go("/pages/library/register");
    },
    changeDate(value) {
      if (value.length > 0) {
        this.form.startTime = value[0];
        this.form.endTime = value[1];
      } else {
        this.$delete(this.form, "startTime");
        this.$delete(this.form, "endTime");
      }
      this.getList();
    },
    changeSecle(value) {
      console.log(value, "选择类型");
      if (value) {
        if (value != 3) {
          this.form.type = value;
        } else {
          this.$delete(this.form, "type");
        }
        this.getList();
      }
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
@import "@/static/css/library.scss";
.early-warning-status {
  width: 50%;
  .early-warning-btn {
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
::v-deep .uni-date-x {
  height: 30px;
}
.search-model{
  margin-top: 20rpx;
}
</style>
