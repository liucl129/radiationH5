<template>
  <view class="home-container old">
    <view class="home-head">
      <view class="home-head-text">
        <view class="home-head-text-one d-flex-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongsi"></use>
          </svg>
          <p>当前公司</p>
        </view>
        <view class="home-head-text-two">
          {{ info.qymc }}
        </view>
        <view class="home-head-text-three">
          <span>证书编号：</span><span>{{ info.qyxh }}</span>
        </view>
        <view class="d-flex d-flex-end">
          <view
            class="look-btn d-flex-item d-flex-center"
            @click="companyClick('/pages/sourceManagement/index')"
          >
            <span>查看详情</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jiantou"></use>
            </svg>
          </view>
        </view>
      </view>
      <view class="home-head-tips">
        {{ info.dwlx == 1 ? "移动源企业" :info.dwlx == 0 ? "固定源企业":"" }}
      </view>
    </view>
    <view class="home-conter d-flex d-space-between">
      <view
        class="home-conter-model"
        :style="'width:' + widthGrid + 'rpx'"
        v-for="(item, i) in gridList"
        :key="i"
        @click="companyClick(item.page)"
      >
        <view v-if="gridShow">
          <view class="home-conter-model-top">
            <view class="ome-conter-model-title">
              {{ item.name }}
            </view>
            <p v-if="item.num > 0">
              {{ item.num >= 99 ? "99" : item.num }}
              <span v-if="item.num > 99">+</span>
            </p>
          </view>
          <view class="home-conter-model-foot d-flex-item d-space-between">
            <p>{{ item.title }}</p>
            <p class="d-flex-item d-flex-center">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#' + item.svg"></use>
              </svg>
            </p>
          </view>
        </view>
        <view v-else>
          <view class="home-conter-model-top-four d-flex-item d-space-between">
            <view class="top-four">
              <view class="ome-conter-model-title">{{ item.name }}</view>
              <view class="ome-conter-model-title1">{{ item.title }}</view>
              <p v-if="item.num > 0">
                {{ item.num >= 99 ? "99" : item.num }}
                <span v-if="item.num > 99">+</span>
              </p>
            </view>
            <p class="d-flex-item d-flex-center">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#' + item.svg"></use>
              </svg>
            </p>
          </view>
        </view>
      </view>
    </view>
    <view class="home-footer">
      <view class="home-footer-top">
        <view class="home-footer-title"> 预警自查（{{ warningNum }}） </view>
        <p>
          <span>注:</span
          ><span>单位自查需要在预警发出2小时内进行。超时警示</span
          ><span>橙色</span>
        </p>
      </view>
      <mescroll-uni
        :top="headTop"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
        @init="initCallback"
      >
        <view class="home-footer-list body-padding">
          <view class="home-footer-model" v-for="(item, i) in numList" :key="i">
            <view class="home-footer-list-one d-flex-item">
              <ul>
                <li>预警时间:</li>
                <li>{{ item.yjsjStr ? item.yjsjStr : "暂无" }}</li>
              </ul>
              <ul>
                <li>预警类型:</li>
                <li>{{ item.yjnr ? item.yjnr : "暂无" }}</li>
              </ul>
              <ul>
                <li>源编码:</li>
                <li>{{ item.fsybm ? item.fsybm : "暂无" }}</li>
              </ul>
            </view>
            <view
              class="home-footer-list-two d-flex-item d-space-between"
              @click="lookDetail(item)"
            >
              <p>前往处理</p>
              <image src="../../static/svg/right-orange-icon.svg" alt="" />
            </view>
            <image
              class="overtime-icon"
              src="../../static/img/overtime@2x.png"
              mode=""
            ></image>
          </view>
        </view>
      </mescroll-uni>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      gridList: [
        {
          name: "预警自查",
          title: "待自查",
          svg: "icon-yujingzicha",
          num: "0",
          page: "/pages/earlyWarning/index",
        },
        {
          name: "整改管理",
          title: "待管理",
          svg: "icon-zhenggaiguanli",
          num: "0",
          page: "/pages/rectification/record",
        },
        {
          name: "巡检管理",
          title: "减少风险",
          svg: "icon-xunchaguanli",
          num: "0",
          page: "/pages/inspection/index",
        },
        {
          name: "作业登记",
          title: "登记保存",
          svg: "icon-zuoyedengji",
          num: "0",
          page: "/pages/task/index",
        },
        {
          name: "出入库管理",
          title: "库存详情",
          svg: "icon-churuku",
          num: "0",
          page: "/pages/library/index",
        },
        {
          name: "备案管理",
          title: "历史留存",
          svg: "icon-beianguanli",
          num: "0",
          page: "/pages/keepOnRecord/index",
        },
      ],
      inspection: [1, 2, 3],
      PatrolInfoCtrForm: {
        pageNo: 1,
        pageSize: 10,
      },
      form: {
        pageNo: 1,
        pageSize: 10,
      },
      info: {},
      formList: {
        pageNo: 1,
        pageSize: 20,
        status: 0,
      },
      formZg: {
        pageNo: 1,
        pageSize: 20,
        zgzt: 0,
      },
      warningNum: "",
      rectifyNum: "",
      // 下拉上拉
      infolist: [],
      numList: [],
      mescroll: null, //实例
      upOption: {
        use: true, // 是否启用上拉加载; 默认true
        auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10, // 每页数据的数量,默认10 （这是在后台配置的）
        },
        noMoreSize: 15, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
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
      widthGrid: "",
      gridShow: false,
    };
  },
  onLoad() {
    // console.log(this.formList,"------------")
    // this.$DataStore.localSet('Token',"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOnsianNwdG9rZW4iOm51bGwsImFjY291bnRJZCI6bnVsbCwidXNlcmlkIjoiMDAwMDAwMDAwMDAwMTE5IiwicmVhbG5hbWUiOiLnjovkuIDljZoiLCJsb2dpbm5hbWUiOiJ3eWIiLCJpc1Zpc2l0b3IiOmZhbHNlLCJ1bml0Y29kZSI6IjMzMDEwNiIsImRlcGFydGlkIjoiMzMwMTA2MDAwMDgiLCJsb2dpbnRpbWUiOiIyMDIyLTA2LTAyIDA5OjE1OjIyIiwicm9sZWlkIjoiMzMwMDAwMDAyIiwieWhseCI6IjAiLCJmYWlsdXJlVGltZSI6IjIwMjItMDYtMDIgMTU6MTU6MjIiLCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV91c2VyIn1dLCJ1c2VybmFtZSI6Ind5YiJ9LCJ1c2VyX25hbWUiOiJ3eWIiLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjU0MTc1NzIyLCJhdXRob3JpdGllcyI6WyJST0xFX3VzZXIiXSwianRpIjoiMTM3N2ExNTItN2VjYy00MWMzLThhOTItOThkZTNhODhiZDQzIiwiY2xpZW50X2lkIjoiYnJvd3NlciJ9.Cbns7QcT5fOQ3_SSwZr8DPjhbc53bbbeUzlRKe-D1_Y")
    this.headTop = uni.getSystemInfoSync().statusBarHeight + 800;
    let _this = this;
    async function fn() {
      // await _this.goLogin();
      await _this.infoGet();
      await _this.getZg(_this.formZg);
    }
    fn();

    // console.log(this.widthGrid, "每个快的宽度", this.gridList.length);
  },
  watch: {
    gridList: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal, "深度监听");
        this.widthGrid =
          newVal.length == 6
            ? 540 / (newVal.length / 2)
            : 580 / (newVal.length / 2);
      },
    },
  },
  onShow() {
    if (this.$DataStore.localGet("moveToken")) {
      if (this.mescroll != null) this.mescroll.resetUpScroll();
    }
  },
  methods: {
    getGrid(value) {
      this.widthGrid =
        this.gridList.length == 6
          ? 540 / (this.gridList.length / 2)
          : 580 / (this.gridList.length / 2);

      // return;
      console.log("********001",this.info.dwlx);

      if (this.info.dwlx == 0) {
        this.gridList = [
          {
            name: "预警自查",
            title: "待自查",
            svg: "icon-yujingzicha",
            num: this.gridList[0].num,
            page: "/pages/earlyWarning/index",
          },
          {
            name: "整改管理",
            title: "待管理",
            svg: "icon-zhenggaiguanli",
            num: this.gridList[1].num,
            page: "/pages/rectification/record",
          },
          {
            name: "巡检管理",
            title: "减少风险",
            svg: "icon-xunchaguanli",
            num: "0",
            page: "/pages/inspection/index",
          },
          {
            name: "备案管理",
            title: "历史留存",
            svg: "icon-beianguanli",
            num: "0",
            page: "/pages/keepOnRecord/index",
          },
        ];
      }

      if (this.gridList.length == 6) {
        this.gridShow = true;
      } else {
        this.gridShow = false;
      }
    },
    goLogin() {
      this.$Net.post(this.$api.login, { username: "cbd" }, 1, 0).then((res) => {
        // console.log(res.data.accessToken, "登录成功");
        this.$DataStore.localSet("moveToken", res.data.accessToken);
      });
    },
    companyClick(url, param) {
      this.$Jump.Open(url);
    },
    // 企业信息
    infoGet() {
      this.$Net.post(this.$api.enterpriseInfoGet, this.form, 1).then((res) => {
        this.info = res.data;
        this.getGrid( this.info)
        this.$DataStore.localSet("enterpriseCode", this.info.qyxh);
        this.$DataStore.localSet("dwlx", this.info.dwlx);
      });
    },
    // 整改
    getZg(parmas) {
      this.$Net.post(this.$api.getRectifyPage, parmas, 1).then((res) => {
        let newData = res.data;
        this.rectifyNum = newData.total;
        this.gridList[1].num = newData.total;
      });
    },
    // 查看详情
    lookDetail(value) {
      this.go(
        "/pages/earlyWarning/feedback?yjxxbh=" + value.yjxxbh + "&type=" + 0
      );
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    // 下拉分页
    downCallback(mescroll) {
      this.mescroll.resetUpScroll();
    },
    // 列表内容
    initCallback(mescroll) {
      this.mescroll = mescroll;
    },
    // 预警
    upCallback(mescroll) {
      let pageNum = mescroll.num; // 页码, 默认从1开始
      let pageSize = mescroll.size; // 页长, 默认每页10条
      this.formList.pageNo = pageNum;
      this.formList.pageSize = pageSize;
      this.$Net
        .get(this.$api.earlyWarningList, this.formList, 1)
        .then((res) => {
          let records = res.data.records;
          let newData = res.data;
          if (res.records == 0) {
            //从第几条开始
            mescroll.endByPage(0, 0);
            return false;
          }
          if (pageNum == 1) this.numList = [];
          this.numList = this.numList.concat(res.data.records);
          this.mescroll.endBySize(records.length, newData.total);
          this.warningNum = newData.total;
          this.gridList[0].num = newData.total;
        });
    },
  },
};
</script>

<style lang="scss" scoped src="../../static/css/home.scss">
// @import "~@/static/css/home.scss";
// .old{
//   .home-head{
// 			.home-head-text{
// 				.home-head-text-one{
// 					p{
// 						font-size: $uni-old-h6;
// 					}
// 				}
// 				.home-head-text-two{
// 					font-size: $uni-old-h5;
// 				}
// 				.home-head-text-three{
// 					margin-left: 36rpx;
// 					span{
// 						&:nth-child(1){
// 							font-size: $uni-old-h4;

// 						}
// 						&:nth-child(2){
// 							font-size: 24rpx;
// 						}
// 					}
// 				}
// 				.look-btn{
// 					font-size: 22rpx;
// 				}
// 			}
// 		}

// 		.home-conter{
// 			.home-conter-model{
// 				.home-conter-model-top{
// 					.ome-conter-model-title{
// 						font-size: 28rpx;
// 					}
// 					p{
// 						font-size: 20rpx;
// 					}
// 				}
// 				.home-conter-model-foot{
// 					p{
// 						&:nth-child(1){
// 							font-size: 22rpx;
// 						}
// 					}
// 				}
// 			}
// 		}
// 		.home-footer{
// 		.home-footer-top{
// 			margin: 40rpx 0 20rpx 0;
// 			.home-footer-title{
// 				height: 44rpx;
// 				font-size: 28rpx;
// 				font-weight: 600;
// 				color: #2E6FF0;
// 				line-height: 40rpx;
// 			}
// 			p{
// 				margin-top: 24rpx;
// 				span{
// 					&:nth-child(1){
// 						font-size: 24rpx;
// 						color: #666666;
// 						font-weight: 600;
// 					}&:nth-child(2){
// 						font-size: 24rpx;
// 						color: #ACACAC ;
// 						font-weight: 600;
// 					}&:nth-child(3){
// 						font-size: 24rpx;
// 						color: #FF6A00;
// 						font-weight: 600;
// 					}
// 				}
// 			}
// 		}
// 		.home-footer-list{
// 			.home-footer-model{
// 				padding: 0 20rpx 24rpx 20rpx;
// 				height: 228rpx;
// 				background: #FFFFFF;
// 				box-shadow: 0px 4rpx 8rpx 4rpx rgba(71, 95, 180, 0.1);
// 				border-radius: 16rpx;
// 				position: relative;
// 				margin-bottom: 32rpx;
// 				.home-footer-list-one{
// 					flex-wrap: wrap;
// 					ul{
// 						margin-top: 24rpx;
// 						display: flex;
// 						li{
// 							&:nth-child(1){
// 								width: 130rpx;
// 								text-align: right;
// 								color: $uni-two-color;
// 								font-size: 26rpx;
// 								font-weight: 600;
// 							}
// 							&:nth-child(2){
// 								color: $uni-three-color;
// 								font-size: 26rpx;
// 								margin-right:30rpx;
// 								margin-left: 16rpx;
// 							}
// 						}
// 					}
// 				}
// 				.home-footer-list-two{
// 					height: 100rpx;
// 					margin-top: 32rpx;
// 					border-top:1px solid $uni-border-1;
// 					p{
// 						font-size: 24rpx;
// 						font-weight: 600;
// 						color: $uni-warning;
// 					}
// 					image{
// 						width: 26rpx;
// 						height: 52rpx;
// 					}
// 				}
// 				.overtime-icon{
// 					width: 122rpx;
// 					height: 98rpx;
// 					position: absolute;
// 					top: -4px;
// 					right: -7px;
// 				}

// 			}
// 		}
// 		}
// }
</style>
