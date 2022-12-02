<template>
	<view class="keep-on-details">
		<view class="details-head">
			<p class="d-flex-item d-flex-center">放射源信息</p>
			<ul>
				<li>核素:</li>
				<li>1245668</li>
			</ul>
			<ul>
				<li>编码:</li>
				<li>嘀嘀嘀</li>
			</ul>
			<ul>
				<li>出厂日期:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>出厂活度(bq):</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>标号:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>类别:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>用途:</li>
				<li>5555</li>
			</ul>
		</view>

		<view class="details-head">
			<ul>
				<li>送贮单位:</li>
				<li>1245668</li>
			</ul>
			<ul>
				<li>证书编号:</li>
				<li>嘀嘀嘀</li>
			</ul>
			<ul>
				<li>通讯地址:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>经办人:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>电话/传真:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>邮箱:</li>
				<li>5555</li>
			</ul>
		</view>

		<view class="details-head">
			<ul>
				<li>接收单位:</li>
				<li>1245668</li>
			</ul>
			<ul>
				<li>证书编号:</li>
				<li>嘀嘀嘀</li>
			</ul>
			<ul>
				<li>通讯地址:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>经办人:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>电话/传真:</li>
				<li>5555</li>
			</ul>
			<ul>
				<li>邮箱:</li>
				<li>5555</li>
			</ul>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.keep-on-details {
		.details-head {
			background: #FFFFFF;
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
						color: #AEAEAE;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
