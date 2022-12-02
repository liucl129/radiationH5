<template>
	<view class="table-model">
		<uni-table ref="table" :loading="loading" emptyText="暂无更多数据">
			<uni-tr>
				<uni-th :width="width" v-for="(item,index) in title" :key="index">{{item.key}}</uni-th>
				<uni-th width="70">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="(ite, j) in table" :key="j">
				<uni-td v-for="(item,index) in title" :key="index">{{ite[item.value]?ite[item.value]:"" }}</uni-td>
				<uni-td>
					<view class="uni-group" @click="lookDetail(ite)">
						{{operation}}
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script>
	export default {
		props: {
			operation:{
				type:String,
				default:{
					return:""
				}
			},
			title: {
				type: Array,
				default: {
					return: []
				}
			},
			table: {
				type: Array,
				default: {
					return: []
				}
			}
		},
		data() {
			return {
				loading: false,
				width:90
			}
		},
		watch: {
			title: {
				immediate: true,//首次加载
				deep: true, // 深度监听
				handler(newVal, oldVal) {
					let num = newVal.length
					if(num==2){
						this.width=130
					}
				}
			}
		},
		methods:{
			lookDetail(value){
				this.$emit("lookDetail",value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.table-model {

		.uni-table-th,
		.uni-table-td {
			border: none;
			word-break:break-all;
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
</style>
