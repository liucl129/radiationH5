<template>
	<view class="inspection-head-right screen" @click="change">
		<view class="screen-text">
			筛选
		</view>
		<svg class="icon screen-img" :class="[searchBtn?'screen-img-top':'screen-img-down']" aria-hidden="true">
			<use xlink:href="#icon-jiantou"></use>
		</svg>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				searchBtn:false
			}
		},
		methods:{
			change(){
				this.searchBtn=!this.searchBtn;
				this.$emit("changeBtn")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inspection-head-right {
		::v-deep .uni-stat__select {
			padding: 0;
		}

		::v-deep .uni-select {
			width: 162rpx;
			height: 76rpx;
			border-radius: $uni-border-radius;
			border: 2rpx solid #E3E3E3;
		}

		::v-deep .uni-stat__actived {
			outline: 1px solid #ffffff;
		}

		::v-deep .uni-select__input-box {
			width: 132rpx !important;
		}
	}

	.screen {
		width: 132rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		border: 2rpx solid #E3E3E3;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: $uni-secondary-color;

		.screen-img {
			width: 22rpx;
			height: 24rpx;
			margin-left: 20rpx;
		}

		.screen-img-top {
			transform: rotate(-90deg);
		}

		.screen-img-down {
			transform: rotate(90deg);
		}
	}
</style>
