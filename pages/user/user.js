// pages/user/user.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		collect: [] // 商品收藏数组
	},

	onShow: function (options) {
		let userInfo = wx.getStorageSync('userInfo') || {};
		let collect = wx.getStorageSync('collect') || [];
		this.setData({
			userInfo,
			collect
		});
	},
	getUserInfo(e) {
		let {
			userInfo
		} = e.detail;
		console.log(userInfo);
		this.setData({
			userInfo
		});
		wx.setStorageSync('userInfo', userInfo);
	}
})