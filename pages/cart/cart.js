// pages/cart/cart.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		cartData: [],
		totalValue: 0,
		totalCount: 0,
		allChecked: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let cartData = wx.getStorageSync('cart');
		cartData.forEach(i => i.checked = false);
		this.setData({
			cartData
		})
	},

	handleItemCheck(e) {
		let {
			index
		} = e.currentTarget.dataset;
		let {
			cartData
		} = this.data;
		let {
			checked
		} = cartData[index];
		cartData[index].checked = !checked;
		let allChecked = cartData.every(i => i.checked);
		this.setData({
			cartData,
			allChecked
		})
		this.calcTotal();
	},

	handleCheckAll(e) {
		let {
			cartData,
			allChecked
		} = this.data;
		cartData.forEach(i => i.checked = !allChecked);
		this.setData({
			allChecked: !allChecked,
			cartData
		})
		this.calcTotal();
	},

	handleChangeNum(e) {
		let {
			index,
			symbol
		} = e.currentTarget.dataset;
		let {
			cartData
		} = this.data;
		if (symbol == "+") {
			cartData[index].num += 1;
		} else {
			cartData[index].num -= 1;
		}
		if (cartData[index].checked) {
			this.calcTotal();
		}
		this.setData({
			cartData
		})
		wx.setStorage({
			key: 'cart',
			data: cartData
		});

	},
	calcTotal() {
		let totalValue = 0,
			totalCount = 0;
		this.data.cartData.forEach((item, index) => {
			if (item.checked) {
				totalValue += item.num * item.goods_price;
				totalCount += item.num;
			}
		})
		this.setData({
			totalValue,
			totalCount
		})
	}
})