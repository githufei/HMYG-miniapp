// pages/goods_detail/goods_detail.js
import request from '../../request/index.js';

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

	// 跳转到购物车
	gotoCart() {
		wx.switchTab({
			url: '/pages/cart/cart'
		});
	},

	// 点击加入购物车 -- 由于后台的限制，才有本地缓存购物车数据的形式来实现
	// 点击加入购物车时，先判断微信缓存数据中是否存在该商品，存在则将数量+1，然后重新存入缓存；不存在在将当前商品信息及数量 1 添加到缓存中
	handleAddCart() {
		let cartData = wx.getStorageSync('cart') || [];
		let {
			goodsDetail
		} = this.data;
		let currentGoods = cartData.find(i => i.goods_id == goodsDetail.goods_id);
		if (currentGoods) {
			currentGoods.num++;
		} else {
			cartData.push({
				...goodsDetail,
				num: 1,
				checked: true
			})
		}
		wx.setStorageSync('cart', cartData);
		wx.showToast({
			title: '加入购物车成功',
			icon: 'success',
			mask: true
		});
	}
})