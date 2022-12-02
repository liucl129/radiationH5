<template>
	<view class="">
		<!-- #ifdef H5 -->
		<view class="" id="map1" ref="map1" style="width: 100%; height: 600rpx;"></view>
		<!-- #endif -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/location.png'
				}, {
					latitude: 39.90,
					longitude: 116.39,
					iconPath: '../../../static/location.png'
				}]
			}
		},
		onLoad: function(e) {
			this.loadScrpit();
		},
		methods: {
			loadScrpit(address, bol) {
				let self = this;
				AMapUI.loadUI(["misc/PositionPicker"], function(PositionPicker) {
					var map = new AMap.Map("map1", {
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						zoomToAccuracy: true,
						zoom: 15,
						scrollWheel: false,
						dragEnable: true, //是否可拖动
						resizeEnable: true,
						rotateEnable: true,
						//center: address && address.lng ? [address.lng, address.lat] : [118.78025,31.972952] //初始化地图中心点
					});
					self.map = map

					var positionPicker = new PositionPicker({
						mode: "dragMap",
						map: map,
						iconStyle: { //自定义外观
							url: self.icon,
							ancher: [24, 40],
							size: [1, 1],
						}
					});
					positionPicker.on("success", function(positionResult) {
						console.log("里获得当前位置和移动中心点都能触发", positionResult);
						//这里自行处理逻辑
						//这里获得当前位置和移动中心点都能触发，且返回经纬度和附近信息
					});
					positionPicker.on("fail", function(positionResult) {
						//这里自行处理逻辑
						console.log(`定位失败:` + positionResult);
					});
					positionPicker.start();
					map.panBy(0, 1);
				});
			},
		}
	}
</script>

<style>
</style>
