<template>
  <view class="inspection">
    <view class="inspection-head d-flex-item d-space-between">
      <view class="inspection-head-left d-flex-item">
        <p>已巡检：{{cuntNumOff}}</p>
				<p>未巡检：{{cuntNumNo}}</p>
				<!-- <p>/{{cuntNumNo}}</p> -->
        
       <!--  <uni-datetime-picker
          v-model="timeNum"
          type="daterange"
          @change="changeClick"
        /> -->
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
    <!-- 列表 -->
    <mescroll-uni
      :top="headTop"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="initCallback"
    >
      <view class="inspection-list body-padding">
        <sourceModel
          :data="data"
          :list="numList"
          name="详情"
          :color="true"
          @lookDetail="lookDetail"
          :tips="false"
        />
      </view>
    </mescroll-uni>

    <view class="ok-btn d-flex-item d-flex-center" @click="startClick()">
      开始巡检
    </view>
  </view>
</template>

<script>
import searchBtn from "../../components/search-btn/index.vue";
import searchModel from "../../components/search-model/index.vue";
import ccPicker from "@/components/cc-picker/cc-picker.vue";
import sourceModel from "@/components/source-model";
export default {
  components: {
    sourceModel,
    ccPicker,
    searchModel,
    searchBtn,
  },
  data() {
    return {
      single: "",
      searchShow: false,
      activeIndex: 0,
      btns: ["待处理", "已处理"],
      value: 0,
      range: [
        {
          value: 1,
          text: "正常",
        },
        {
          value: 2,
          text: "源丢失",
        },
        {
          value: 3,
          text: "入库",
        },
      ],
      data: [
        {
          key: "巡检时间",
          value: "sbsj",
        },
        // {
        //   key: "设备编号",
        //   value: "sbh",
        // },
        {
          key: "剂量状态",
          value: "sfzc",
        },
      ],
      cuntNumNo:0,
      cuntNumOff:0,
      list: [],
      form: {
        pageNo: 1,
        pageSize: 10,
        startTime: "",
        endTime: "",
      },
      // 下拉上拉组件参数 start
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
      //   end
    };
  },
  created() {
    // this.headTop = uni.getSystemInfoSync().statusBarHeight;
    this.form.startTime = this.$Common.getDate();
  },
  onShow(){
    if (this.mescroll != null) this.mescroll.resetUpScroll();
    this.getCunt()
  },
  methods: {
    getCunt(){
      this.$Net.post(this.$api.PatrolgetXjCount,{},0).then(res=>{
        if(res.data){this.cuntNumNo=res.data[0].value; this.cuntNumOff=res.data[1].value}
      })
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
      this.$Net.post(this.$api.PatrolInfoCtrGet, this.form, 0).then((res) => {
        if (res.records == 0) {
          //从第几条开始
          mescroll.endByPage(0, 0);
          return false;
        }
        if (pageNum == 1) this.numList = [];
        this.numList = this.numList.concat(res.data.records)
        this.mescroll.endBySize(res.data.records.length, res.data.total);
      });
    },
    get() {
      this.$Net.post(this.$api.PatrolInfoCtrGet, this.form, 1).then((res) => {
        // return res;
        // console.log(res.data, "--------");

        res.data.records.forEach((item, i) => {
          if (item.zt == "1") {
            this.$set(item, "status", "正常");
          } else if (item.zt == "2") {
            this.$set(item, "status", "源丢失");
          } else if (item.zt == "3") {
            this.$set(item, "status", "入库");
          }
        });
        this.list = res.data.records;
      });
    },
    lookDetail(value) {
      this.go("/pages/inspection/details?xh=" + value.xh);
    },
    startClick() {
      this.go("/pages/inspection/backups");
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    statusClick(index) {
      this.activeIndex = index;
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
    changeBtn() {
      this.searchShow = !this.searchShow;
      if (this.searchShow) {
        this.headTop = 195;
      } else {
        this.headTop = 115;
      }
    },
    changeSecle(val) {
      console.log(val, "下拉调用");
    },
    changeDate(e) {
      console.log(e, "------------------确认选择时间");

      if (e.length>0) {
        this.form.startTime = e[0];
        this.form.endTime = e[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
      this.mescroll.resetUpScroll();
    },
  },
};
</script>


<style lang="scss" scoped>
@import "@/static/css/inspection.scss";
::v-deep .uni-date-x {
  height: 30px;
}
// ::v-deep .uni-date__icon-clear {
//   right: -6px;
//   border: 4px solid transparent;
// }
</style>
