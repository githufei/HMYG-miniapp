// pages/user/user.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {}
	},

	onShow: function (options) {
		let userInfo = wx.getStorageSync('userInfo') || {};
		this.setData({
			userInfo
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
	},
	setUserInfo() {

	}
})