import request from '../../request/index.js';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		swiperList: [],
		catList: [],
		floorList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.requestSwiperList();
		this.requestCatList();
		this.requestFloorList();
	},
	requestSwiperList() {
		request({
			url: '/home/swiperdata'
		}).then((data) => {
			data.forEach((i) => (i.goods_id = i.navigator_url.split('?')[1].replace('goods_id=', '')));
			this.setData({
				swiperList: data
			});
		});
	},
	requestCatList() {
		request({
			url: '/home/catitems'
		}).then((data) => {
			this.setData({
				catList: data
			});
		});
	},
	requestFloorList() {
		request({
			url: '/home/floordata'
		}).then((data) => {
			data.forEach((i) => {
				i.product_list.forEach((v) => {
					v.query = v.navigator_url.split('?')[1].replace('query=', '');
				});
			});
			this.setData({
				floorList: data
			});
		});
	}
});
