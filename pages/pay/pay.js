// pages/pay/pay.js
import {
	chooseAddress,
	requestPayment
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
		this.setCart(payGoods);
	},

	setCart(payGoods) {
		let totalValue = 0,
			totalCount = 0;
		payGoods.forEach((item, index) => {
			if (item.checked) {
				totalValue += item.num * item.goods_price;
				totalCount += item.num;
			}
		})
		this.setData({
			totalValue,
			totalCount,
			payGoods
		})
		wx.setStorageSync('cart', payGoods);
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
					header: {
						Authorization: token
					},
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
					header: {
						Authorization: token
					},
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
					header: {
						Authorization: token
					},
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
				wx.navigateTo({
					url: '/pages/auth/auth'
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