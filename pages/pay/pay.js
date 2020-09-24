// pages/pay/pay.js
import {
	chooseAddress
} from '../../utils/util.js'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		cartData: [],
		totalValue: 0,
		totalCount: 0,
		address: {}
	},

	onShow: function () {
		let address = wx.getStorageSync('address') || {};
		let cartData = (wx.getStorageSync('cart') || []).filter(i => i.checked);
		this.setData({
			address
		});
		this.setCart(cartData);
	},

	setCart(cartData) {
		let totalValue = 0,
			totalCount = 0;
		cartData.forEach((item, index) => {
			if (item.checked) {
				totalValue += item.num * item.goods_price;
				totalCount += item.num;
			}
		})
		this.setData({
			totalValue,
			totalCount,
			cartData
		})
		wx.setStorageSync('cart', cartData);
	},

	async changeAddress() {
		let address = await chooseAddress();
		this.setData({
			address
		});
		wx.setStorage({
			key: 'address',
			data: address
		});
	},

	handlePay() {
		let {
			address
		} = this.data;
		if (!address.userName) {
			wx.showToast({
				title: '请先添加收货地址',
				icon: "none",
				mask: true
			});
		} else {
			wx.navigateTo({
				url: '/pages/pay/pay'
			});
		}
	}
})