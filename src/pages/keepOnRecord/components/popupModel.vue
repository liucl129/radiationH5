<template>
	<view class="uni-container">
		<uni-table ref="table" :loading="loading" type="selection" emptyText="暂无更多数据"
			@selection-change="selectionChange" :filter-type="search">
			<uni-tr>
				<uni-th width="100" align="left">源编码</uni-th>
				<uni-th width="70" align="left">类别</uni-th>
				<uni-th width="90" align="left">源类型</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td>{{ item.fsybm }}</uni-td>
				<uni-td>
					<view class="name">{{ item.fsylb }}</view>
				</uni-td>
				<uni-td align="left">{{ item.sfkyd==0?"固定":"移动" }}</uni-td>
			</uni-tr>
		</uni-table>
		<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="totalNum" @change="change" /></view>
	</view>
</template>

<script>
	export default {
		props:{
			tableData:{
				type:Array,
				default:[]
			},
			totalNum:{
				type:[String,Number],
				default:0
			}
		},
		data() {
			return {
				searchVal: '',
				// 每页数据量
				pageSize: 10,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false
			}
		},
		onLoad() {
			this.selectedIndexs = []
			// this.getData(1)
		},
		methods: {
			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.tableData[i])
			},
			// 多选
			selectionChange(e) {
				console.log(e.detail.index,"--------",e)
				this.selectedIndexs = e.detail.index
				this.$emit("selectionChange",this.selectedIndexs)
			},
			//批量删除
			delTable() {
				console.log(this.selectedItems())
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				// this.getData(e.current)
				this.pageCurrent = e.current
				this.$emit("getSource",e.current)
			},
			// 搜索
			search() {
				this.getData(1, this.searchVal)
			},
			// 获取数据
			getData(pageCurrent, value = '') {
				this.loading = true
				this.pageCurrent = pageCurrent
				this.request({
					pageSize: this.pageSize,
					pageCurrent: pageCurrent,
					value: value,
					success: res => {
						// console.log('data', res);
						this.tableData = res.data
						this.total = res.total
						this.loading = false
					}
				})
			},
			// 伪request请求
			request(options) {
				const {
					pageSize,
					pageCurrent,
					success,
					value
				} = options
				let total = tableData.length
				let data = tableData.filter((item, index) => {
					const idx = index - (pageCurrent - 1) * pageSize
					return idx < pageSize && idx >= 0
				})
				if (value) {
					data = []
					tableData.forEach(item => {
						if (item.name.indexOf(value) !== -1) {
							data.push(item)
						}
					})
					total = data.length
				}

				setTimeout(() => {
					typeof success === 'function' &&
						success({
							data: data,
							total: total
						})
				}, 500)
			}
		}
	}
</script>

<style lang="scss">
	/* #ifndef H5 */
	/* page {
	padding-top: 85px;
} */
	/* #endif */
	.uni-group {
		display: flex;
		align-items: center;
	}
	.uni-popup__wrapper{
		border-radius: 16rpx;
	}
	.uni-container {
		uni-table-td {
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
	}
</style>
