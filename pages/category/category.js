// pages/category/category.js
import {
	request
} from '../../utils/util.js';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		categories: [],
		rightContent: [],
		activeId: null,
		scrollTop: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.loadCategories();
	},

	async loadCategories() {
		let categories;
		let cache = wx.getStorageSync("categories");
		// 根据缓存时间判断缓存是否过期，这里假设 10s 后缓存过期，实际中可以把这个值放大一点
		if (cache && Date.now() - cache.ts < (10 * 1000)) {
			categories = cache.data;
		} else {
			categories = await request({
				url: '/categories'
			})
			// 缓存数据并设置缓存时间
			wx.setStorageSync('categories', {
				ts: Date.now(),
				data: categories
			})
		}
		this.setData({
			categories,
			activeId: categories[1].cat_id,
			rightContent: categories[1].children
		})
	},

	handleTapLefItem(e) {
		let content = e.currentTarget.dataset.content;
		this.setData({
			rightContent: content.children,
			activeId: content.cat_id,
			scrollTop: 0 // 切换分类的时候让右侧页面滚动到顶部
		})
	}
});