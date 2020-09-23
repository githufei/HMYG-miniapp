import {
	request
} from '../../utils/util.js';
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
	onLoad: function (options) {
		this.requestSwiperList();
		this.requestCatList();
		this.requestFloorList();
	},
	requestSwiperList() {
		request({
			url: '/home/swiperdata'
		}).then((
			data
		) => {
			this.setData({
				swiperList: data
			});
		});
	},
	requestCatList() {
		request({
			url: '/home/catitems'
		}).then((
			data
		) => {
			this.setData({
				catList: data
			});
		});
	},
	requestFloorList() {
		request({
			url: '/home/floordata'
		}).then((
			data
		) => {
			this.setData({
				floorList: data
			});
		});
	}
});