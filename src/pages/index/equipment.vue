<template>
  <view class="keep-on-details">
    <view class="details-head">
      <p class="d-flex-item d-flex-center">备案信息</p>
      <ul>
        <li>设备名称:</li>
        <li>{{ details.sbmc }}</li>
      </ul>
      <ul>
        <li>设备用途:</li>
        <li>{{ details.sbyt }}</li>
      </ul>
      <ul>
        <li>所属公司:</li>
        <li>{{ details.ssqy }}</li>
      </ul>
      <ul>
        <li>放射源数量:</li>
        <li>{{ details.num }}</li>
      </ul>
    </view>
    <view class="table-model">
      <uni-table ref="table" :loading="loading" emptyText="暂无更多数据">
        <uni-tr>
          <uni-th
            :width="item.width"
            v-for="(item, index) in taskTitle"
            :key="index"
            >{{ item.key }}</uni-th
          >
          <uni-th width="50">操作</uni-th>
        </uni-tr>
        <uni-tr v-for="(ite, j) in list" :key="j">
          <uni-td v-for="(item, index) in taskTitle" :key="index">
            {{
              item.value == "sfkyd"
                ? ite[item.value] == 1
                  ? "移动"
                  : "固定"
                : ite[item.value]
            }}
          </uni-td>
          <uni-td>
            <view class="uni-group" @click="lookDetail(ite)"> 详情 </view>
          </uni-td>
        </uni-tr>
      </uni-table>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      width: "90",
      taskTitle: [
        {
          key: "源编码",
          value: "fsybm",
          width: "70",
        },
        {
          key: "类别",
          value: "fsylb",
          width: "70",
        },
        {
          key: "源类型",
          value: "sfkyd",
          width: "70",
        },
        {
          key: "状态",
          value: "kczt",
          width: "70",
        },
      ],
      list: [],
      details: {},
    };
  },
  onLoad(opstion) {
    this.getDetail(opstion);
  },
  methods: {
    getDetail(value) {
      this.$Net.post(this.$api.sourceEquipInfo, value, 1).then((res) => {
        console.log(res, "----------");
        this.details = res.data;
        this.list = res.data.sourceInfoList;
      });
    },
    go(url, parms) {
      this.$Jump.Open(url);
    },
    lookDetail(value) {
      this.go("/pages/sourceManagement/details?fsyxh=" + value.fsyxh);
    },
  },
};
</script>

<style lang="scss" scoped>
.keep-on-details {
  .details-head {
    background: #ffffff;
    box-shadow: 0px 4rpx 8rpx 4rpx rgba(71, 95, 180, 0.03);
    border-radius: 16px;
    font-size: 26rpx;
    padding-bottom: 32rpx;
    margin-bottom: 32rpx;

    &:not(:first-child) {
      padding-top: 24rpx;
    }

    p {
      width: 146rpx;
      // height: 56rpx;
      padding: 10rpx 20rpx;
      background: rgba(46, 111, 240, 0.08);
      border-radius: 16rpx 0px 16rpx 0px;
      color: $uni-primary;
      font-weight: 600;
      margin-bottom: 34rpx;
    }

    ul {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;
      li {
        &:nth-child(1) {
          width: 33%;
          color: #666666;
          font-weight: 600;
          text-align: right;
        }

        &:nth-child(2) {
          width: 70%;
          color: #aeaeae;
          margin-left: 20rpx;
        }
      }
    }
  }
  .table-model {
    .uni-table-th,
    .uni-table-td {
      border: none;
      word-break: break-all;
      vertical-align: text-top;
    }

    .uni-table-th {
      color: $uni-main-color;
    }

    .uni-table-td {
      color: $uni-base-color;

      .uni-group {
        color: $uni-primary;
      }
    }

    .table-model-head {
      p {
        font-size: 26rpx;
        font-weight: 600;
        color: #666666;
      }
    }
  }
}
</style>
