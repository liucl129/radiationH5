<template>
  <view class="early-warning">
    <view class="early-warning-head d-flex-item d-space-between">
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
      <view class="early-warning-select">
        <searchBtn @changeBtn="changeBtn"></searchBtn>
      </view>
    </view>
    <searchModel
      class="searchModel"
      v-if="searchShow"
      :range="range"
      @changeSecle="changeSecle"
      @changeDate="changeDate"
    ></searchModel>
    <view class="early-warning-tips">
      <p>
        <span>注:</span><span>单位自查需要在预警发出2小时内进行。超时警示</span
        ><span>橙色</span>
      </p>
    </view>
    <mescroll-uni
      :top="210 + headTop * 2"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="initCallback"
    >
      <view class="source-list">
        <sourceModel
          :data="data"
          :list="numList"
          :name="activeIndex==1?'查看':'处理'"
          :color="true"
          @lookDetail="lookDetail"
          :tips="false"
          :stutasFalse="activeIndex==1?false:true"
        />
      </view>
    </mescroll-uni>
  </view>
</template>

<script>
import ccPicker from "@/components/cc-picker/cc-picker.vue";
import sourceModel from "@/components/source-model";
import searchBtn from "../../components/search-btn/index.vue";
import searchModel from "../../components/search-model/index.vue";
export default {
  components: {
    sourceModel,
    ccPicker,
    searchBtn,
    searchModel,
  },
  data() {
    return {
      searchShow: false,
      person: {
        sex: "1",
        sex_str: "",
        country: "1",
        country_str: "",
      },
      activeIndex: 0,
      btns: ["待处理", "已处理"],
      value: 0,
      range: [
        {
          value: 4,
          text: "全部",
        },
        {
          value: 1,
          text: "移动源预警",
        },
        {
          value: 2,
          text: "巡查预警",
        },
        {
          value: 3,
          text: "固定源预警",
        },
      ],
      data: [
        {
          key: "预警时间",
          value: "yjsjStr",
        },
        {
          key: "预警类型",
          value: "yjnr",
        },
        {
          key: "源编码",
          value: "fsybm",
        },
      ],
      list: [],
      form: {
        pageNo: 1,
        pageSize: 10,
        status: "0",
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
      headTop: 0,
    };
  },
  onLoad() {
    // this.getList();
  },
  onShow(){
    this.getList()
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
      this.$Net.get(this.$api.earlyWarningList, this.form, 0).then((res) => {
        if (res.records == 0) {
          //从第几条开始
          mescroll.endByPage(0, 0);
          return false;
        }
        if (pageNum == 1) this.numList = [];
        let records = res.data.records;
        let newData = res.data;
        if (res.records == 0) {
          //从第几条开始
          mescroll.endByPage(0, 0);
          return false;
        }
        if (pageNum == 1) this.numList = [];
          records.forEach(element => {
            // 0固定源预警 1移动源预警 2 巡检预警
            if(element.yjlx==0){
              element.yjlx='固定源预警'
            }else if(element.yjlx==1){
              element.yjlx='移动源预警'
            }else if(element.yjlx==2){
              element.yjlx='巡检预警'
            }
            
          });
        this.numList = this.numList.concat(res.data.records)
        this.mescroll.endBySize(records.length, newData.total);
      });
    },
    changeBtn() {
      this.searchShow = !this.searchShow;
    },
    lookDetail(value) {
      this.go(
        "/pages/earlyWarning/feedback?yjxxbh=" +
          value.yjxxbh +
          "&type=" +
          this.activeIndex
      );
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    statusClick(index) {
      this.activeIndex = index;
      this.form.status = index;
      this.getList();
    },
    change(val) {
      if (val == 1) {
        console.log(val, "====");
        this.$refs.picker.show();
      }
    },
    show() {
      this.$refs.picker.show();
    },
    confirm(e) {
      console.log(e, "选择时间回调");
    },
    sex_change(e) {
      this.person.sex_str = e.new_k;
    },
    changeSecle(value) {
      if (value == 3) {
        this.form.yjlx = 0;
      } else if (value == 1) {
        this.form.yjlx = value;
      } else if (value == 2) {
        this.form.yjlx = value;
      }else{
        this.$delete(this.form,"yjlx")
      }
      this.getList();
    },
    changeDate(value) {
      console.log("选择日期", value);
      if (value.length > 0) {
        this.form.kssj = value[0];
        this.form.jssj = value[1];
      }else{
        this.$delete(this.form,'kssj')
        this.$delete(this.form,'jssj')
      }
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.early-warning {
  .early-warning-head {
    height: 108rpx;

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

    .early-warning-select {
      ::v-deep .uni-stat__select {
        padding: 0;
      }

      ::v-deep .uni-select {
        width: 162rpx;
        height: 76rpx;
        border-radius: $uni-border-radius;
        border: 2rpx solid #e3e3e3;
      }

      ::v-deep .uni-stat__actived {
        outline: 1px solid #ffffff;
      }

      ::v-deep .uni-select__input-box {
        width: 132rpx !important;
      }
    }
  }

  .early-warning-tips {
    p {
      margin: 20rpx 0;

      span {
        &:nth-child(1) {
          font-size: 24rpx;
          color: #666666;
          font-weight: 600;
        }

        &:nth-child(2) {
          font-size: 24rpx;
          color: #acacac;
          font-weight: 600;
        }

        &:nth-child(3) {
          font-size: 24rpx;
          color: #ff6a00;
          font-weight: 600;
        }
      }
    }
  }
  .source-list {
    padding: 0 32rpx;
  }
}
</style>
