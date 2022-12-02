<template>
  <view class="rectification-record">
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
    <!-- 搜索 -->
    <searchModel
      class="searchModel"
      v-if="searchShow"
      :range="range"
      @changeDate="changeDate"
      @changeSecle="changeSecle"
    ></searchModel>
    <!-- 列表 -->
    <mescroll-uni
      :top="headTop"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @init="initCallback"
    >
      <view class="source-list body-padding">
        <view class="home-footer-model" v-for="(item, i) in list" :key="i">
          <view class="head-title-top d-flex-item d-space-between">
            <view class="head-title-left d-flex-item d-flex-center">
              <span>放射源编码：</span> {{ item.fsybm }}
            </view>
            <view class="head-title-right">
              <span :class="[item.zgzt == '已整改' ? 'p-blue' : 'p-warning']">{{
                activeIndex == 1 ? "已整改" : "待整改"
              }}</span>
            </view>
          </view>
          <view class="home-footer-list-one d-flex-item">
            <ul v-for="(ite, j) in data" :key="ite.value">
              <li>{{ ite.key }}:</li>
              <li>{{ item[ite.value] ? item[ite.value] : "暂无" }}</li>
            </ul>
          </view>
          <view
            class="home-footer-list-two d-flex-item d-space-between"
            @click="lookClick(item)"
          >
            <p :class="[item.type != 1 ? 'p-blue' : 'p-warning']">{{activeIndex==1?'查看详情':'前往处理'}}</p>
            <view class="d-flex-item d-space-around">
              <image
                v-if="item.type != 1"
                src="../../static/svg/right-blue-icon.svg"
                alt=""
              />
              <image
                v-else
                src="../../static/svg/right-orange-icon.svg"
                alt=""
              />
            </view>
          </view>
        </view>
      </view>
    </mescroll-uni>
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
      searchShow: false,
      person: {
        sex: "1",
        sex_str: "",
        country: "1",
        country_str: "",
      },
      list_sex: [
        {
          id: "1",
          text: "男",
        },
        {
          id: "2",
          text: "女",
        },
      ],
      activeIndex: 0,
      btns: ["待整改", "已整改"],
      value: 0,
      range: [
        {
          value: 0,
          text: "全部",
        },
        // {
        //   value: 1,
        //   text: "通过",
        // },
        // {
        //   value: 2,
        //   text: "未通过",
        // },
      ],
      data: [
        {
          key: "发布时间",
          value: "kssjStr",
        },
        {
          key: "截止时间",
          value: "jssjStr",
        },
        {
          key: "整改类型",
          value: "zglx",
        },
        {
          key: "整改状态",
          value: "zgzt",
        },
      ],
      list: [],
      form: {
        pageNo: 1,
        pageSize: 50,
        zgzt: "0",
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
  onLoad() {
    // this.headTop = uni.getSystemInfoSync().statusBarHeight;
    // console.log( this.headTop,"头部高度")
    
    this.get();
  },
  onShow(){
    this.getList();
  },
  methods: {
    get() {
      this.$Net.post(this.$api.warnCofigCtrList, this.form, 1).then((res) => {
        console.log(res, "预警类型");
        res.data.list.forEach((element) => {
          this.range.push({
            value: element.yjbh,
            text: element.yjnr,
          });
        });
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
      this.$Net.post(this.$api.getRectifyPage, this.form, 0).then((res) => {
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
    changeBtn() {
      this.searchShow = !this.searchShow;
      if (this.searchShow) {
        this.headTop = 195;
      } else {
        this.headTop = 115;
      }
    },
    lookClick(value) {
      this.go("/pages/rectification/feedback?zgbh=" + value.zgbh);
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    statusClick(index) {
      this.activeIndex = index;
      this.form.zgzt = index;
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
      if (value == 0) {
        this.$delete(this.form, "yjlx");
      } else {
        this.form.yjlx = value;
      }
      this.getList();
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/static/css/rectificationRecord.scss";
</style>
