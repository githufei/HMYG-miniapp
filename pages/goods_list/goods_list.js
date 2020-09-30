// pages/goods_list/goods_list.js
import request from '../../request/index.js';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [
			{
				text: '综合',
				value: 'default',
				isActive: true
			},
			{
				text: '销量',
				value: 'sales',
				isActive: false
			},
			{
				text: '价格',
				value: 'price',
				isActive: false
			}
		],
		goodsList: [],
		hasMore: true
	},
	// 请求参数
	queryParams: {
		query: '',
		cid: '',
		pagenum: '1',
		pagesize: '15',
		orderBy: 'default'
	},
	onLoad(options) {
		this.queryParams.cid = options.cid || '';
		this.queryParams.query = options.query || '';
		this.queryGoodsList();
	},

	onReachBottom() {
		if (this.data.hasMore) {
			this.queryGoodsList();
		}
	},
	onPullDownRefresh() {
		this.queryParams.pagenum = '1';
		this.setData({
			goodsList: []
		});
		this.queryGoodsList();
	},
	async queryGoodsList() {
		console.log(this.queryParams);

		let pageData = await request({
			url: '/goods/search',
			data: {
				...this.queryParams
			}
		});
		wx.stopPullDownRefresh();
		let { pagenum, pagesize } = this.queryParams;
		this.setData({
			goodsList: [ ...this.data.goodsList, ...pageData.goods ],
			hasMore: pageData.total - pagenum * pagesize > 0
		});
		this.queryParams.pagenum++;
	},
	// 点击切换激活页签
	changeActiveTab(e) {
		let activeIndex = e.detail.index;
		let { tabs } = this.data;
		let prevActive = tabs.findIndex((i) => i.isActive == true);
		if (activeIndex !== prevActive) {
			tabs.forEach((item, index) => {
				item.isActive = activeIndex == index;
			});
			this.setData({
				tabs
			});
			this.queryParams.orderBy = tabs[activeIndex].value;
			this.queryGoodsList();
		}
	}
});
