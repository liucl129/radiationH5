import config from "./config.js";
let BASE_URL = config.BASE_URL;
let Login_URL = config.Login_URL
let buttonClicked = false
let noClick = true


export class objQs {
	static objKey(obj) {
		let str = ''
		for (var key in obj) {
			str += key + '=' + obj[key] + '&'
		}
		return str.slice(0, -1)
	}

}
export class Net {
	/**
	 * get 请求，不额外添加任何参数
	 * @param url
	 * @param param
	 * @param isLoading 是否显示加载中，1显示0不显示
	 * @returns {Promise<any>}
	 */
	static get(url, param = {}, isLoading = 0) {
		if (isLoading) {
			uni.showLoading({
				title: '加载中'
			});
		}
		var headerD = {
			"Authorization": DataStore.localGet('moveToken'),
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: BASE_URL + url, //仅为示例，并非真实接口地址。
				data: param,
				header: headerD,
				success: (res) => {
					if (res.data.code == 200) {
						resolve(res.data);
					} else if (res.data.code == 500 || res.data.code == 501 || res.data.code == 502 || res.data.code == 503) {
						uni.reLaunch({
							url: "/pages/login/index"
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg || '系统繁忙,请稍后再试'
						})
					}
				},
				fail: (res) => {
					reject('请求失败');
				},
				complete: (res) => {
					uni.hideLoading();
				}
			});
		});
	}

	/**
	 * post 请求，不额外添加任何参数
	 * @param url
	 * @param param
	 * @param isLoading 是否显示加载中，1显示0不显示
	 * @param isReject 报错是否继续操作，1继续0不继续
	 * @returns {Promise<any>}
	 */
	static post(url, param, isLoading = 0, headerType = 1) {
		if (isLoading == 1) {
			uni.showLoading({
				title: '加载中'
			});
		}
		var headerD = {}
		if (headerType == 1) {
			headerD = {
				"Content-Type": "application/x-www-form-urlencoded",
				// "Content-Type":"application/json;charset=UTF-8"
				// application/x-www-form-urlencoded
				"Authorization": DataStore.localGet('moveToken')
			}
		} else {
			headerD = {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: BASE_URL + url, //仅为示例，并非真实接口地址。
				data: param,
				method: 'POST',
				header: headerD,
				success: (res) => {
					if (isLoading == 1) {
						uni.hideLoading();
					}
					if (res.data.code == 200) {
						resolve(res.data);
					} else if (res.data.code == 500 || res.data.code == 501 || res.data.code == 502 || res.data.code == 503) {
						uni.reLaunch({
							url: "/pages/login/index"
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg || '系统繁忙,请稍后再试'
						})
						reject(res.data.msg || '系统错误');
					}
				},
				fail: (res) => {
					reject('服务器开小差了');
					if (isLoading == 1) {
						uni.hideLoading();
					}
				},
				complete: (res) => {
					if (isLoading == 1) {
						uni.hideLoading();
					}

				}
			});
		});
	}


	/**
	 * 上传图片
	 * @param url
	 * @param param
	 * @param isLoading 是否显示加载中，1显示0不显示
	 * @returns {Promise<any>}
	 */
	static uploadFile(url, isLoading = 0) {
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: 1, // 默认9
				// sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
				// sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
				success(res) {
					if (isLoading) {
						uni.showLoading({
							title: '加载中'
						});
					}
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					let tempFilePaths = res.tempFilePaths;
					uni.uploadFile({ //上传
						url: BASE_URL + url,
						filePath: tempFilePaths[0],
						name: "file",
						header: {
							"Content-Type": "multipart/form-data",
							'authorization': 'Bearer ' + DataStore.localGet('token')
						},
						formData: {
							'filename': 'file'
						},
						success(res) {
							let data = JSON.parse(res.data)
							resolve(data);
						},
						fail(res) {
							reject(res);
						},
						complete() {
							uni.hideLoading()
						}
					});
				},
				fail: (err) => {
					console.log('chooseImage fail', err)
					// #ifdef MP
					uni.getSetting({
						success: (res) => {
							let authStatus = res.authSetting['scope.album'];
							if (!authStatus) {
								uni.showModal({
									title: '授权失败',
									content: '需要从您的相册获取图片，请在设置界面打开相关权限',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting()
										}
									}
								})
							}
						}
					})
					// #endif
				}
			});
		});
	}
	//post上传文件
	static postFile(url, path, isLoading = 1) {
		return new Promise((resolve, reject) => {
			if (isLoading) {
				uni.showLoading({
					title: '加载中'
				});
			}
			uni.uploadFile({ //上传
				url: BASE_URL + url,
				filePath: path,
				name: "file",
				header: {
					"Content-Type": "multipart/form-data",
					'authorization': 'Bearer ' + DataStore.localGet('token')
				},
				formData: {
					'filename': 'file'
				},
				success(res) {
					let data = JSON.parse(res.data)
					uni.hideLoading()
					resolve(data);
				},
				fail(res) {
					uni.hideLoading()
					reject(res);
				},
				complete() {
					uni.hideLoading()
				}
			});
		});
	}
	/**
	 * 上传多张图片
	 * @returns {Promise<any>}
	 */
	static uploadFiles(url, param, isLoading = 1) {

		return new Promise((resolve1, reject1) => {
			//将迭代体放在Promise里
			wx.chooseImage({
				count: 9, // 默认9
				sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
				success(res) {
					let tempFilePaths = res.tempFilePaths;
					let promiseList = tempFilePaths.map((item) => {
						// console.log(item)
						return new Promise(resolve => {
							wx.uploadFile({
								url: BASE_URL + url,
								filePath: item,
								name: "upfile",
								success(res) {
									resolve(JSON.parse(res.data));
								},
								fail(res) {
									reject1(res);
								}
							})
						})
					});
					// console.log('promiseList',promiseList)
					const result = Promise.all(promiseList).then((res) => {
						// 返回的res是个数据，对应promiseList中请求的结果，顺序与promiseList相同
						// 在这里也就是在线图片的url数组了
						return res;
					}).catch((error) => {
						console.log(error);
					});
					console.log('result', result)
					resolve1(result);
				},
			});
		});
	}

	static serverTime() {
		return new Promise((resolve, reject) => {
			uni.request({
				url: Login_URL + '/pub/date/getNow', //仅为示例，并非真实接口地址。
				data: {},
				method: 'GET',
				success: (res) => {
					resolve(res.data.data.nowTime)
				},
				fail: (res) => {
					uni.showToast({
						icon: 'none',
						title: '系统繁忙,请稍后再试'
					})
				}
			});

		});
	}
}

/**
 * 路由工具类
 */
export class Jump {
	/**
	 * 
	 * @param {*} url 
	 */

	static upTitle(text) {
		uni.setNavigationBarTitle({
			title: text,
		});
	}
	/**
	 * 路由重定向，关闭当前页面，跳转到应用内的某个页面
	 * @param url
	 * @constructor
	 */
	static Redirect(url) {
		uni.redirectTo({
			url: url
		});
	}

	/**
	 * 直接跳转。保留当前页面
	 * @param url
	 * @constructor
	 */
	static Open(url) {
		uni.navigateTo({
			url: url
		});
	}


	/**
	 * 关闭当前页面，返回上一页面或多级页面
	 * @param index 返回的页面数，如果 delta 大于现有页面数，则返回到首页
	 */
	static Back(delta = 1) {
		uni.navigateBack({
			delta: delta
		});
	}


	/**
	 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
	 */
	static switchTab(url) {
		uni.switchTab({
			url: url //通常是首页/pages/index/index
		});
	}

	/**
	 * 关闭所有页面，打开到应用内的某个页面
	 * @param url  需要跳转的应用内页面路径
	 */
	static reLaunch(url) {
		uni.reLaunch({
			url: url
		});
	}
}

function cancelBounce() {
	console.log(buttonClicked)
	if (!buttonClicked) {
		buttonClicked = true
		setTimeout(() => {
			buttonClicked = false
		}, 1000)
		return true
	} else {
		return false
	}
}




/**
 * 数据存储类
 */
export class DataStore {
	/**
	 * 设置本地缓存
	 * @param key
	 * @param data
	 */
	static localSet(key, data) {
		if (typeof data === "object") data = JSON.stringify(data);
		return uni.setStorageSync(key, data);
	}

	/**
	 * 获取本地缓存
	 * @param key
	 * @returns {*}
	 */
	static localGet(key) {
		let data = uni.getStorageSync(key);
		if (Common.isJson(data)) data = JSON.parse(data);
		return data;
	}

	/**
	 * 删除本地缓存
	 * @param key
	 */
	static localDel(key) {
		return uni.removeStorageSync(key);
	}

	/**
	 * 清楚所有本地缓存
	 * @constructor
	 */
	static ClearLocal() {
		return uni.clearStorage();
	}


	/**
	 * 设置essionStorage
	 * @param key
	 * @param data
	 */
	static SessionSet(key, data) {
		if (Common.isJson(data)) data = JSON.parse(data);
		return sessionStorage.setItem(key, data);
	}

	/**
	 * 获取sessionStorage
	 * @param key
	 * @constructor
	 */
	static SessionGet(key) {
		let data = sessionStorage.getItem(key);
		if (Common.isJson(data)) data = JSON.parse(data);
		return data;
	}

	/**
	 * 删除sessionStorage
	 * @param key
	 */
	static SessionDel(key) {
		return sessionStorage.removeItem(key);
	}

	/**
	 * 清楚所有sessionStorage
	 * @constructor
	 */
	static SessionClear() {
		return sessionStorage.clear();
	}
}

export function openMap(lat, lng, address) {
	//打开地图
	// 先判断定位权限是否开启
	uni.getLocation({
		success() {
			uni.openLocation({
				latitude: lat,
				longitude: lng,
				address: address,
				scale: 28,
				success: function () {
					console.log('success');
				}
			});
		},
		fail(e) {
			// 定位权限未开启，引导设置
			uni.showModal({
				title: '温馨提示',
				content: '您已拒绝定位,请开启',
				confirmText: '去设置',
				success(res) {
					if (res.confirm) {
						uni.openSetting()
					}
				}
			})
		}
	})
}
export class Common {
	/**
	 * 获取当前时间
	 */
	static getDate(date) {
		let d = new Date();
		let Year = d.getFullYear(); //获取年
		let Month =
			d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1; //获取月
		let dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate(); //获取当日
		let h = d.getHours().toString() < 10 ? "0" + d.getHours().toString() : d.getHours().toString();// 时
		let m = d.getMinutes().toString() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString(); // 分
		let s = d.getSeconds().toString() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds().toString(); // 秒
		var time;
		if (date == "yyyy-mm-dd HH:mm:ss") {
			time = Year + "-" + Month + "-" + dd + " " + h + ":" + m + ":" + s;
		} else if (date == "yyyy-mm-dd") {
			time = Year + "-" + Month + "-" + dd;
		} else {
			time = Year + "-" + Month + "-" + dd;
		}
		return time
	}
	/**
	 * 静态图片资源
	 */
	static staticPt(name) {
		return "https://file-szzx.cunyougo.com/wxapp/xianlu/10002/" + name
		// return "/static/img/" + name
	}
	/**
	 * emoji 解析
	 * @param str  emoji字符串
	 * */
	static uncodeUtf16(str) {

		var reg = /\&#.*?;/g;
		var result = str.replace(reg, function (char) {
			var H, L, code;
			if (char.length == 9) {
				code = parseInt(char.match(/[0-9]+/g));
				H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
				L = (code - 0x10000) % 0x400 + 0xDC00;
				return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
			} else {
				return char;
			}
		});
		// console.log(result);
		return result;
	}
	/**
	 * 格式化日期时间
	 * @param fmt  格式
	 * @param date 日期
	 * */
	static dateFormat(fmt, date) {
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	}
	/**
	 * 格式化时间戳
	 * @param data
	 * @param format
	 * @returns {*}
	 */
	static formatTime(data, format) { //时间戳转日期 如：(date,"Y-M-D)或(date,"Y-M-D h:m:s)"
		function formatNumber(n) {
			n = n.toString();
			return n[1] ? n : "0" + n;
		}

		let formateArr = ["Y", "M", "D", "h", "m", "s"];
		let returnArr = [];
		let date = new Date(data * 1000);
		returnArr.push(date.getFullYear());
		returnArr.push(formatNumber(date.getMonth() + 1));
		returnArr.push(formatNumber(date.getDate()));

		returnArr.push(formatNumber(date.getHours()));
		returnArr.push(formatNumber(date.getMinutes()));
		returnArr.push(formatNumber(date.getSeconds()));

		for (let i in returnArr) {
			format = format.replace(formateArr[i], returnArr[i]);
		}
		return format;
	}

	/**
	 * 获取时间戳
	 * @returns {number}
	 */
	static currentTime() {
		return new Date().getTime();
	}

	/**
	 * 生成随机命名
	 * @returns {number}
	 */
	static random_string(len) {
		len = len || 32;
		var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
		var maxPos = chars.length;
		var pwd = "";
		for (let i = 0; i < len; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	}


	/**
	 * 是否json字符串
	 * @param str
	 * @returns {boolean}
	 */
	static isJson(str) {
		if (typeof str === "string") {
			try {
				let obj = JSON.parse(str);
				if (typeof obj === "object" && obj) {
					return true;
				} else {
					return false;
				}
			} catch (e) {
				// console.log("error：" + str + "!!!" + e);
				return false;
			}
		}
		// console.log("It is not a string!");
	}

	/**
	 * 浮点数精度计算加法，解决0.1+0.2!=0.3
	 * @returns {boolean}
	 */
	static add(a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
	}

	/**
	 * 浮点数精度计算减法，解决0.1+0.2!=0.3
	 * @returns {boolean}
	 */
	static sub(a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
	}

	/**
	 * 浮点数精度计算乘法，解决0.1+0.2!=0.3
	 * @returns {boolean}
	 */
	static mul(a, b) {
		var c = 0,
			d = a.toString(),
			e = b.toString();
		try {
			c += d.split(".")[1].length;
		} catch (f) { }
		try {
			c += e.split(".")[1].length;
		} catch (f) { }
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	}

	/**
	 * 浮点数精度计算除法，解决0.1+0.2!=0.3
	 * @returns {boolean}
	 */
	static divi(a, b) {
		var c, d, e = 0,
			f = 0;
		try {
			e = a.toString().split(".")[1].length;
		} catch (g) { }
		try {
			f = b.toString().split(".")[1].length;
		} catch (g) { }
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math
			.pow(10,
				f - e));
	}
	/**
	 * 移除数组中的某个数组并组成新的数组返回
	 * @param array array 需要移除的数组
	 * @param int index 需要移除的数组的键值
	 * @param string | int 值
	 * @return array
	 * 
	 */
	static ArrayRemove(array, index, value) {
		const valueArray = [];
		if (array instanceof Array) {
			for (let i = 0; i < array.length; i++) {
				if (typeof index == 'number' && array[index] != i) {
					valueArray.push(array[i]);
				} else if (typeof index == 'string' && array[i][index] != value) {
					valueArray.push(array[i]);
				}
			}
		}
		return valueArray;
	}
	static deep(obj) {
		//判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
		var objClone = Array.isArray(obj) ? [] : {};
		//进行深拷贝的不能为空，并且是对象或者是
		if (obj && typeof obj === "object") {
			let key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (obj[key] && typeof obj[key] === "object") {
						objClone[key] = deep(obj[key]);
					} else {
						objClone[key] = obj[key];
					}
				}
			}
		}
		return objClone;
	}
	static goJSON(str) {
		if (typeof str == 'string') {
			var obj = JSON.parse(str);
			return obj;
		} else {
			return str;
		}
	}
	/**
	 * 判断手机是否为iphoneX系列
	 */
	static IsIPhoneX() {
		let isIphoneX = false;
		let systemInfo = uni.getSystemInfoSync();
		// #ifdef MP
		if (systemInfo.model.search('iPhone X') != -1 || systemInfo.model.search('iPhone 11') != -1 || systemInfo
			.model.search('iPhone 12') != -1) {
			isIphoneX = true;
		}
		// #endif

		// #ifdef H5
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if (isIOS) {
			if (systemInfo.screenWidth == 375 && systemInfo.screenHeight == 812 && systemInfo.pixelRatio == 3) {
				isIphoneX = true;
			} else if (systemInfo.screenWidth == 414 && systemInfo.screenHeight == 896 && systemInfo.pixelRatio ==
				3) {
				isIphoneX = true;
			} else if (systemInfo.screenWidth == 414 && systemInfo.screenHeight == 896 && systemInfo.pixelRatio ==
				2) {
				isIphoneX = true;
			}
		}
		// #endif
		return isIphoneX;
	}
	/**
	 * 是否是微信浏览器
	 */
	static isWeiXin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 数值转换
	 */
	static goDSP(num) {
		let str = parseInt(Number(num))
		if (str > 1000) {
			return parseInt(str / 1000) + "k+"
		} else {
			return str;
		}
	}
	/**
	 * 复制文本
	 */
	static copyText(num) {
		uni.setClipboardData({
			data: num,
			success: function () {
				uni.showToast({
					title: "复制成功!",
					icon: "none"
				})
			}
		});
	}
	/**
	 * 提示信息 tips
	 */
	static showTips(text) {
		uni.showToast({
			title: text,
			icon: "none"
		})
	}

	// 处理多次点击
	static noMultipleClicks(methods) {
		if (noClick) {
			noClick = false;
			methods();
			setTimeout(function () {
				noClick = true;
			}, 2000)
		} else {
			console.log("请稍后点击")
		}
	}
	// 点击预览图片
	static showImg(imageUrl, key) {
		var images = [];
		// console.log(imageUrl) // http://192.168.100.251:8970/6_1597822634094.png

		if (imageUrl instanceof Array) {
			imageUrl.forEach(element => {
				if (element.path) {
					images.push(element.path)
				} else {
					images.push(element)
				}
			})
		} else {
			images.push(imageUrl);
		}
		// console.log(images) // ["http://192.168.100.251:8970/6_1597822634094.png"]
		uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://192.168.100.251:8970/6_1597822634094.png"]
			current: key,
			urls: images,
			longPressActions: { //长按保存图片到相册
				itemList: ['保存图片'],
				success: (data) => {
					console.log(data);
					uni.saveImageToPhotosAlbum({ //保存图片到相册
						filePath: payUrl,
						success: function () {
							uni.showToast({
								icon: 'success',
								title: '保存成功'
							})
						},
						fail: (err) => {
							uni.showToast({
								icon: 'none',
								title: '保存失败，请重新尝试'
							})
						}
					});
				},
				fail: (err) => {
					console.log(err.errMsg);
				}
			}
		});
	}
	/*
 *数组对象去重
 */
	static newSet(arr, batch) {
		if (!Array.isArray(arr)) {
			return arr;
		}
		if (arr.length == 0) {
			return [];
		}
		let obj = {};
		let uniqueArr = arr.reduce(function (total, item) {
			obj[item[batch]] ? '' : (obj[item[batch]] = true && total.push(item));
			return total;
		}, []);
		return uniqueArr;
	}
}
