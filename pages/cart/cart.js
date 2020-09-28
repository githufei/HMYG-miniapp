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

	onShow: function () {
		let cartData = wx.getStorageSync('cart') || [];
		this.setCart(cartData);
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
		this.setCart(cartData);
	},

	handleCheckAll(e) {
		let {
			cartData,
			allChecked
		} = this.data;
		cartData.forEach(i => i.checked = !allChecked);
		this.setCart(cartData);
	},

	handleChangeNum(e) {
		let {
			index,
			operation
		} = e.currentTarget.dataset;
		let {
			cartData
		} = this.data;
		cartData[index].num += operation;
		this.setCart(cartData);
	},

	setCart(cartData) {
		let totalValue = 0,
			totalCount = 0,
			allChecked = true;
		cartData.forEach((item, index) => {
			if (item.checked) {
				totalValue += item.num * item.goods_price;
				totalCount += item.num;
			} else {
				allChecked = false
			}
		})
		this.setData({
			totalValue,
			totalCount,
			allChecked,
			cartData
		})
		wx.setStorageSync('cart', cartData);
	},

	handleDelete() {
		let {
			cartData
		} = this.data;
		cartData = cartData.filter(i => !i.checked);
		this.setCart(cartData);
	},

	handlePay() {
		let token = wx.getStorageSync('token');
		if (token) {
			wx.navigateTo({
				url: '/pages/pay/pay'
			});
		} else {
			wx.showModal({
				title: '提示',
				content: '您还没有登录',
				confirmText: '去登录',
				success: (result) => {
					if (result.confirm) {
						wx.switchTab({
							url: '/pages/user/user',
						})
					}
				}
			});
		}
	}
})