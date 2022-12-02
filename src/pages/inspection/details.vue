<template>
	<view class="inspection-details">
		<view class="details-head">
			<p class="d-flex-item d-flex-center">基本信息</p>
			<ul>
				<li>源编码:</li>
				<li>{{PatrolInfoCtrForm.fsybm}}</li>
			</ul>
			<ul>
				<li>源类型:</li>
				<li>{{PatrolInfoCtrForm.fsylb}}</li>
			</ul>
			<!-- <ul>
				<li>巡检设备编号:</li>
				<li>{{PatrolInfoCtrForm.sbh}}</li>
			</ul> -->
			<ul>
				<li>辐射剂量率:</li>
				<li>{{PatrolInfoCtrForm.fsz}}</li>
			</ul>

			<ul>
				<li>放射源照片:</li>
				<li class="source-img" >
						
					<image v-for="(item,i) in PatrolInfoCtrForm.imgList" :key="i" :src="item.path" mode="" @click="openImg(PatrolInfoCtrForm.imgList,i)">
					</image>
					<!-- <span v-for="(item,i) in PatrolInfoCtrForm.imgList" :key="i" > {{item.path}}</span> -->
					<!-- <image src="../../static/img/fixed-source-2-bg@2x.png" mode=""></image> -->
				</li>
			</ul>
			<ul>
				<li>定位:</li>
				<li>{{PatrolInfoCtrForm.jd}} {{PatrolInfoCtrForm.wd}}</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PatrolInfoCtrForm: {
					imgList: []
				},
				form: {
					pageNo: 1,
					pageSize: 10,
					xh: ""
				}
			}
		},
		onLoad(opstion) {
			console.log(opstion)
			this.form.xh = opstion.xh
			this.getDeatail(opstion)
		},
		methods: {
			openImg(url,key) {
				let arrNew = []
				url.forEach(element => {
					arrNew.push(element.path)
				});
				this.$Common.showImg(arrNew,key)
			},
			getDeatail(value) {
				this.$Net.post(this.$api.PatrolInfoCtrdetails, this.form, 1).then(res => {
					// console.log(res.data, "--------")
					this.PatrolInfoCtrForm = res.data
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/inspectionDetails.scss";
</style>
