// pages/pay/pay.js
import {
	chooseAddress,
	requestPayment,
	getSetting,
	openSetting
} from '../../utils/util.js'

import request from '../../request/index.js';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		payGoods: [],
		totalValue: 0,
		totalCount: 0,
		address: {}
	},

	onShow: function () {
		let address = wx.getStorageSync('address') || {};
		address.full = address.provinceName + address.cityName + address.countyName + address.detailInfo;
		let payGoods = (wx.getStorageSync('cart') || []).filter(i => i.checked);
		this.setData({
			address
		});
		this.setGoodList(payGoods);
	},

	setGoodList(payGoods) {
		let totalValue = 0,
			totalCount = 0;
		payGoods.forEach((item, index) => {
			totalValue += item.num * item.goods_price;
			totalCount += item.num;
		})
		this.setData({
			totalValue,
			totalCount,
			payGoods
		})
		wx.setStorageSync('cart', payGoods);
	},

	/* 
		获取用户的收货地址
		1 绑定点击事件
		2 调用小程序内置api获取用户的收货地址 wx.chooseAddress 

		直接获取存在的问题：如果在授权弹窗点击取消，就不能再次获取了
		解决方案：
		1. 获取用户对小程序所授予获取地址的权限状态scope -- wx.getSetting
			1 假设用户点击获取地址的提示框--确定 authSetting['scope.address'] 值 true--可以直接调用 chooseAddress api获取地址
			2 假设用户点击获取地址的提示框--取消 authSetting['scope.address'] 值 false--不能直接调用 chooseAddress api获取地址
				针对这种情况，需要引导用户自己打开授权设置页面(wx.openSetting)，当用户重新授权后，再调用 chooseAddress api 获取用户地址
			3 假设用户从来没有调用过地址的api -- authSetting['scope.address'] 值 undefined--可以直接调用获取地址
		*/
	async handleGetAddress() {
		try {
			let {
				authSetting
			} = await getSetting();
			if (authSetting['scope.address'] === false) {
				await openSetting();
			}
			let address = await chooseAddress();
			this.setData({
				address
			});
			wx.setStorage({
				key: 'address',
				data: address
			});
		} catch (err) {
			console.log(err);
		}
	},
	async changeAddress() {
		let address = await chooseAddress();
		address.full = address.provinceName + address.cityName + address.countyName + address.detailInfo;
		this.setData({
			address
		});
		wx.setStorage({
			key: 'address',
			data: address
		});
	},

	/**
	 * 支付
	 * 1. 先判断缓存中有没有 token，没有 token，跳转到授权界面，有 token，生成预付订单
	 * 3. 根据预付订单号调用后台生成微信支付需要的支付参数
	 * 4. 调用微信付款
	 * 5. 获取支付状态，如果支付成功跳转支付订单记录
	 */
	async handlePay() {
		if (!this.data.address.userName) {
			wx.showToast({
				title: '请先添加收货地址',
				icon: "none",
				mask: true
			});
			return;
		}
		try {
			let token = wx.getStorageSync('token');
			let {
				payGoods,
				address,
				totalValue
			} = this.data;
			if (token) {
				// 生成订单号
				let {
					order_number
				} = await request({
					url: "/my/orders/create",
					method: "POST",
					data: {
						order_price: totalValue, // 订单总价格
						consignee_addr: address.full, // 收货地址
						goods: payGoods.map(i => {
							return {
								goods_id: i.goods_id, // 商品id
								goods_number: i.num, // 购买的数量
								goods_price: i.goods_price, // 单价
							}
						})
					}
				})

				// 获取支付参数 -- pay 为微信支付所必需的参数
				let {
					pay
				} = await request({
					url: "/my/orders/req_unifiedorder",
					method: "POST",
					data: {
						order_number
					}
				})
				console.log(pay);

				// 发起微信支付 -- 目前会报"requestPayment:fail no permission"，可能是用的 AppID 与实际生成支付参数时用的 AppID 不同
				await requestPayment(pay);

				// 查询支付结果
				let result = await request({
					url: "/my/orders/chkOrder",
					method: "POST",
					data: {
						order_number
					}
				});
				await showToast({
					title: '支付成功'
				});
				// 删除掉缓存购物车中支付成功的数据
				let cartData = wx.getStorageSync('cart');
				wx.setStorageSync('cart', cartData.filter(i => !i.checked));
				// 跳转到订单页面
				wx.navigateTo({
					url: '/pages/order/order'
				});
			} else {
				wx.switchTab({
					url: '/pages/user/user',
				});
			}
		} catch (err) {
			console.log(err);
			// 由于不能支付成功，这里为了向下执行流程，支付失败时也执行支付成功的逻辑
			let cartData = wx.getStorageSync('cart');
			wx.setStorageSync('cart', cartData.filter(i => !i.checked));
			wx.showToast({
				icon: "none",
				title: '支付失败'
			});
		}
	}
})