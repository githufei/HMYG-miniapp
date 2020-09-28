// pages/user/user.js
import {
	login
} from '../../utils/util.js'
import request from '../../request/index.js';
Page({
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

	// 授权界面点击授权按钮， 发送获取 token 的请求， 按照接口文档请求参数： encryptedData， rawData， v， signature， code。 前 4 个可以在 button open - type = "getUserInfo"  得到，code 可以在 wx.login 后得到
	async getUserInfo(e) {
		// 获取用户信息
		let {
			rawData,
			signature,
			encryptedData,
			iv,
			userInfo
		} = e.detail;
		// 获取小程序登录成功后的code
		let {
			code
		} = await login();
		// 发送请求，获取 token
		/* 		
		let res = await request({
			url: "/users/wxlogin",
			method: "POST",
			data: {
				rawData,
				signature,
				encryptedData,
				iv,
				code
			}
		})
		*/
		// 正常情况下从 res 中就可以获得 token 值，但由于后台权限的问题，用自己的用户是登陆不了的，使用一个能用的假 token
		let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";

		// 将 token 和 userinfo 存在缓存中
		this.setData({
			userInfo
		});
		wx.setStorageSync('userInfo', userInfo);
		wx.setStorageSync('token', token);
	}
})