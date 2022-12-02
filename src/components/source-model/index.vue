<template>
	<view class="source-model">
		<view class="home-footer-list">
			<view class="home-footer-model" v-for="(item,i) in list" :key="i">
			
				<view class="home-footer-list-one d-flex-item d-space-between">
					<ul v-for="(ite,j) in data" :key="ite.value">
						<li>{{ite.key}}:</li>
						<li>{{item[ite.value]?item[ite.value]:"暂无"}}</li>
					</ul>
				</view>
				<view class="home-footer-list-two d-flex-item d-space-between" @click="lookClick(item)">
					<p :class="[item.sfcs!='超时'||!stutasFalse? 'p-blue' :'p-warning']" ><span :class="[name!=''?name:item.jszysj?'':'p-warning']">{{name!=""?name:item.jszysj?"查看详情":"结束作业"}}</span> </p>
					<view class="d-flex-item d-space-around">
						<p :class="[item.sfcs!='超时'? 'p-blue' :'p-warning']" v-if="tips">已超时请尽快处理</p>
						<image v-if="item.sfcs!='超时'||!stutasFalse" :src="require('../../static/img/right-blue-icon.png')" alt="" />
            
						<image v-if="item.sfcs=='超时'&&stutasFalse" :src="require('../../static/img/right-orange-icon.png')" alt="" />
					</view>

				</view>
				<view class="overtime-icon" v-if="stutasFalse">
					<image v-if="item.sfcs=='超时'" class="" src="../../static/img/overtime@2x.png" mode=""></image>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: "",
    },
    color: {
      type: Boolean,
      default: true,
    },
    tips: {
      type: Boolean,
      default: false,
    },
    stutasFalse: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  data() {
    return {};
  },
  methods: {
    lookClick(value) {
      // console.log(value);
      this.$emit("lookDetail", value);
    },
  },
};
</script>

<style lang="scss" scoped>
$uni-one-color: #2c2c2c;
$uni-two-color: #666666;
$uni-three-color: #acacac;

.source-model {
  .home-footer-list {
    .home-footer-model {
      padding: 0 20rpx 0 20rpx;
      // height: 228rpx;
      background: #ffffff;
      box-shadow: 0px 4rpx 8rpx 4rpx rgba(71, 95, 180, 0.1);
      border-radius: 16rpx;
      margin-bottom: 32rpx;
      position: relative;

      .home-footer-list-one {
        flex-wrap: wrap;

        ul {
          // width: 50%;
          // border: 1px solid #2C2C2C;
          margin-top: 24rpx;
          display: flex;
          li {
            &:nth-child(1) {
              text-align: right;
              color: $uni-two-color;
              font-size: 26rpx;
              font-weight: 600;
              white-space: nowrap;
            }

            &:nth-child(2) {
              // max-width:200rpx;
              color: $uni-three-color;
              font-size: 26rpx;
              margin-right: 20rpx;
              margin-left: 12rpx;
            }
          }
        }
      }

      .home-footer-list-two {
        height: 70rpx;
        margin-top: 32rpx;
        border-top: 1px solid $uni-border-1;

        p {
          font-size: 24rpx;
          font-weight: 600;
          color: $uni-warning;
        }

        .p-blue {
          color: $uni-primary;
        }

        .p-warning {
          color: $uni-warning;
        }

        image {
          width: 26rpx;
          height: 26rpx;
        }
      }

      .overtime-icon {
        width: 122rpx;
        height: 98rpx;
        position: absolute;
        top: -4px;
        right: -7px;
        image {
          width: 122rpx;
          height: 98rpx;
        }
      }
    }
  }
}
</style>
