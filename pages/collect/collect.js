// pages/collect/collect.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [{
				text: "商品收藏",
				code: "goods",
				isActive: true,
			},
			{
				text: "品牌收藏",
				code: "brand",
				isActive: false,
			}, {
				text: "店铺收藏",
				code: "shop",
				isActive: false,
			}, {
				text: "浏览足迹",
				code: "footprint",
				isActive: false,
			}
		]
	},

	onShow: function () {
		let pages = getCurrentPages();
		let {
			tab = "goods"
		} = pages[pages.length - 1].options;
		let {
			tabs
		} = this.data;
		tabs.forEach(i => i.isActive = i.code == tab);
		console.log(tabs, 123);

		let collect = wx.getStorageSync('collect') || [];
		this.setData({
			collect,
			tabs
		});
	},
	// 点击切换激活页签
	changeActiveTab(e) {
		let activeIndex = e.detail.index;
		let {
			tabs
		} = this.data;
		let prevActive = tabs.findIndex(i => i.isActive == true);
		if (activeIndex !== prevActive) {
			tabs.forEach((item, index) => {
				item.isActive = activeIndex == index;
			})
			this.setData({
				tabs
			})
		}
	}
})