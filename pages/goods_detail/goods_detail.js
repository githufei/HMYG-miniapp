// pages/goods_detail/goods_detail.js
import {
	request
} from '../../utils/util.js';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goodsDetail: {},
		previewImageUrls: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.requestGoodsDetail(options.goods_id);
	},

	gotoCart() {
		wx.switchTab({
			url: '/pages/cart/cart'
		});
	},

	// 预览轮播图大图
	handlePreviewImage(e) {
		let {
			index
		} = e.currentTarget.dataset;
		let {
			previewImageUrls
		} = this.data;
		wx.previewImage({
			current: previewImageUrls[index],
			urls: previewImageUrls
		});
	},

	async requestGoodsDetail(id) {
		let goodsDetail = await request({
			url: "/goods/detail",
			data: {
				goods_id: id
			}
		})
		this.setData({
			// 精简存在页面 data 中的数据，可以优化性能
			goodsDetail: {
				goods_id: goodsDetail.goods_id,
				goods_name: goodsDetail.goods_name,
				goods_price: goodsDetail.goods_price,
				goods_introduce: goodsDetail.goods_introduce,
				pics: goodsDetail.pics
			},
			previewImageUrls: goodsDetail.pics.map(i => i.pics_big)
		})
		console.log(this.data.goodsDetail);

	}
})