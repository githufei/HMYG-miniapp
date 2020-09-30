// pages/search/search.js
import request from '../../request/index.js';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		searchVal: '',
		searchResult: []
	},
	timerId: -1, // 初始定时器赋一个值，输入防抖用
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {},
	handleInput(e) {
		let { value } = e.detail;
		this.setData({
			searchVal: value
		});
		// 输入防抖
		clearTimeout(this.timerId);
		this.timerId = setTimeout(() => {
			this.searchGoods(value);
		}, 1000);
	},
	handleCancel(e) {
		this.setData({
			searchVal: '',
			searchResult: []
		});
	},
	async searchGoods() {
		if (!this.data.searchVal.trim()) return;
		let searchResult = await request({
			url: '/goods/qsearch',
			data: {
				query: this.data.searchVal
			}
		});
		this.setData({
			searchResult
		});
	}
});
