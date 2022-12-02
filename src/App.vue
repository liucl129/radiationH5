<script>
	import "@/static/aliicon/iconfont.js"
	export default {
		onLaunch: function() {
			// console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	
	// 项目主要元素
	// 字体颜色
	$uni-one-color:#2C2C2C;
	$uni-two-color:#666666;
	$uni-three-color:#ACACAC;
	// 边框半径
	$uni-radius-border:16rpx;
	// 设置整个项目的背景色
	page {
		width: 750rpx;
		padding: 20rpx 32rpx;
		background-color: #F7F8FD;
		letter-spacing:1px;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	/*css reset*/
	body,h1,h2,h3,h4,h5,h6,p,ul,ol,form{
	    margin:0;
	}
	h1,h2,h3,h4,h5,h6,input,select,textarea {
	    font-size: 100%
	}
	ul,ol{
	    padding-left:0; 
	    list-style-type:none;
	}
	/*image with no-border*/
	a img{border:0;}
	img{border:0;display: inline-block;}
	
	//全局公用布局
	.d-flex{
		display: flex;
	}
	.d-flex-item{
		display: flex;
		align-items: center;
	}
	.d-flex-center{
		justify-content: center;
	}
	.d-flex-start{
		justify-content: flex-start;
	}
	.d-flex-end{
		justify-content: flex-end;
	}
	.d-space-around{
		justify-content: space-around;
	}
	.d-space-between{
		justify-content: space-between;
	}
	.d-space-evenly{
		justify-content: space-evenly;
	}
	.body-padding{
		padding-left: 32rpx;
		padding-right: 32rpx;
	}
</style>
