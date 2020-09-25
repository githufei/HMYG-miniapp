// pages/order/order.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [{
			text: "全部",
			isActive: true,
		}, {
			text: "待付款",
			isActive: false,
		}, {
			text: "待发货",
			isActive: false,
		}, {
			text: "退款/退货",
			isActive: false,
		}],
		scrollTop: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {
			tabs
		} = this.data;
		tabs.forEach((item, index) => item.isActive = index == options.type - 1);
		this.setData({
			tabs
		})

	},
	changeActiveTab(e) {
		let {
			tabs
		} = this.data;
		tabs.forEach((item, index) => item.isActive = index == e.detail.index);
		this.setData({
			tabs
		})
	},

})