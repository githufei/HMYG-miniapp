// pages/cart/cart.js
import {
	getSetting,
	chooseAddress,
	openSetting
} from '../../utils/util.js';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		cartData: [],
		totalValue: 0,
		totalCount: 0,
		allChecked: false,
		address: {}
	},

	onShow: function () {
		let address = wx.getStorageSync('address') || {};
		let cartData = wx.getStorageSync('cart') || [];
		this.setData({
			address
		});
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

	/* 
	获取用户的收货地址
	1 绑定点击事件
	2 调用小程序内置api获取用户的收货地址 wx.chooseAddress 

	直接获取存在的问题：如果在授权弹窗点击取消，就不能再次获取了
	解决方案：
	1. 获取用户对小程序所授予获取地址的权限状态scope -- wx.getSetting
		1 假设用户点击获取地址的提示框--确定 authSetting['scope.address'] 值 true--可以直接调用 chooseAddress api获取地址
		2 假设用户点击获取地址的提示框--取消 authSetting['scope.address'] 值 false--不能直接调用 chooseAddress api获取地址
			针对这种情况，需要引导用户自己打开授权设置页面(wx.openSetting)，当用户重新授权后，再调用 chooseAddress api 获取用户地址
		3 假设用户从来没有调用过地址的api -- authSetting['scope.address'] 值 undefined--可以直接调用获取地址
	*/
	async handleGetAddress() {
		try {
			let {
				authSetting
			} = await getSetting();
			if (authSetting['scope.address'] === false) {
				await openSetting();
			}
			let address = await chooseAddress();
			this.setData({
				address
			});
			wx.setStorage({
				key: 'address',
				data: address
			});
		} catch (err) {
			console.log(err);
		}
	},

	async changeAddress() {
		let address = await chooseAddress();
		this.setData({
			address
		});
		wx.setStorage({
			key: 'address',
			data: address
		});
	},

	handleDelete() {
		let {
			cartData
		} = this.data;
		cartData = cartData.filter(i => !i.checked);
		this.setCart(cartData);
	},

	handlePay() {
		let {
			address
		} = this.data;
		if (!address.userName) {
			wx.showToast({
				title: '请先添加收货地址',
				icon: "none",
				mask: true
			});
		} else {
			wx.navigateTo({
				url: '/pages/pay/pay'
			});
		}
	}
})