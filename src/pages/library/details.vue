<template>
  <view class="library-details">
    <!-- 基本信息 -->
    <view class="details-head">
      <ul>
        <li>放射源编码:</li>
        <li>{{ sourceInfo.fsybm ? sourceInfo.fsybm : "" }}</li>
      </ul>
      <ul>
        <li>核素名称:</li>
        <li>{{ sourceInfo.hsmc ? sourceInfo.hsmc : "" }}</li>
      </ul>
      <ul>
        <li>生产厂家:</li>
        <li>{{ sourceInfo.sccj ? sourceInfo.sccj : "" }}</li>
      </ul>
      <ul>
        <li>放射源类别:</li>
        <li>{{ sourceInfo.fsylb ? sourceInfo.fsylb : "" }}</li>
      </ul>
      <ul>
        <li>放射源用途:</li>
        <li>{{ sourceInfo.fsyyt ? sourceInfo.fsyyt : "" }}</li>
      </ul>
    </view>
    <!-- 出库时间 -->
    <view class="details-head">
      <ul>
        <li>出库时间:</li>
        <li>{{ storageOut.cksj ? storageOut.cksj : "" }}</li>
      </ul>
      <ul>
        <li>剂量率:</li>
        <li>{{ storageOut.jll ? storageOut.jll : "" }}</li>
      </ul>
      <!-- <ul>
        <li>出库单位:</li>
        <li>{{ storageOut.sydw ? storageOut.sydw : "" }}</li>
      </ul>
      <ul>
        <li>联系人:</li>
        <li>{{ storageOut.lxr ? storageOut.lxr : "" }}</li>
      </ul>
      <ul>
        <li>联系方式:</li>
        <li>{{ storageOut.lxfs ? storageOut.lxfs : "" }}</li>
      </ul> -->

      <ul>
        <li>图片详情:</li>
        <li>
          <image
            :src="item.path"
            mode=""
            v-for="(item, i) in storageOut.outimgs"
            :key="i"
            @click="showImg(storageOut.outimgs, item.path)"
          ></image>
        </li>
      </ul>
    </view>
    <!-- 入库时间 -->
    <view class="details-head">
      <ul>
        <li>入库时间:</li>
        <li>{{ storageIn.rksj||"" }}</li>
      </ul>
      <ul>
        <li>剂量率:</li>
        <li>{{ storageIn.jll||"" }}</li>
      </ul>
      <!-- <ul>
        <li>入库单位:</li>
        <li>{{ storageIn.szdw||"" }}</li>
      </ul>
      <ul>
        <li>联系人:</li>
        <li>{{ storageIn.zclxr||"" }}</li>
      </ul>
      <ul>
        <li>联系方式:</li>
        <li>{{ storageIn.zclxfs||"" }}</li>
      </ul> -->
      <ul>
        <li>图片详情:</li>
        <li>
          <image
            :src="item.path"
            mode=""
            v-for="(item, j) in storageIn.inimgs"
            :key="j"
            @click="showImg(storageIn.inimgs, item.path)"
          ></image>
        </li>
      </ul>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      details: {},
      sourceInfo: {},
      storageOut: {},
      storageIn: {},
    };
  },
  onLoad(opstion) {
    this.getDetails(opstion);
  },
  methods: {
    getDetails(value) {
      this.$Net.post(this.$api.getStorageInfo, value, 1).then((res) => {
        let newData = res.data;
        this.sourceInfo = newData.sourceInfo?newData.sourceInfo:{};
        this.storageOut = newData.storageOut?newData.storageOut:{};
        this.storageIn = newData.storageIn?newData.storageIn:{};
      });
    },
    showImg(arr, key) {
      this.$Common.showImg(arr, key);
    },
  },
};
</script>

<style lang="scss" scoped>
.library-details {
  .details-head {
    background: #ffffff;
    box-shadow: 0px 4rpx 8rpx 4rpx rgba(71, 95, 180, 0.03);
    border-radius: 16px;
    font-size: 26rpx;
    padding-bottom: 32rpx;
    margin-bottom: 32rpx;
    padding-top: 20rpx;
    p {
      width: 146rpx;
      height: 56rpx;
      background: rgba(46, 111, 240, 0.05);
      border-radius: 16rpx 0px 16rpx 0px;
      color: $uni-primary;
      font-weight: 600;
      margin-bottom: 34rpx;
    }
    ul {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;
      &:nth-last-child(1) {
        margin: 0;
        display: flex;
        align-items: flex-start;
        li {
          image {
            width: 140rpx;
            height: 112rpx;
            border-radius: 8rpx;
            margin: 8rpx;
          }
        }
      }
      li {
        &:nth-child(1) {
          width: 28%;
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
}
</style>