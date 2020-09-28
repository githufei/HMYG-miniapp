// pages/order/order.js
import request from '../../request/index.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [{
			text: "全部",
			isActive: true,
		}, {
			text: "待付款",
			isActive: false,
		}, {
			text: "待发货",
			isActive: false,
		}, {
			text: "退款/退货",
			isActive: false,
		}],
		scrollTop: 0,
		orders: []
	},

	onShow: function () {
		// onShow 中没有 options 参数，要想在 onShow 生命周期中使用 options 参数，可以从页面栈中去取，页面栈是一个数组，最多存放 10 个页面，最后一个就是当前页面
		let pages = getCurrentPages();
		let currentPage = pages[pages.length - 1];
		let {
			options
		} = currentPage;
		let {
			tabs
		} = this.data;
		tabs.forEach((item, index) => item.isActive = index == options.type - 1);
		this.setData({
			tabs
		})
		this.queryOrders(options.type)
	},
	onReachBottom() {
		console.log('1111');

	},
	changeActiveTab(e) {
		let {
			tabs
		} = this.data;
		tabs.forEach((item, index) => item.isActive = index == e.detail.index);
		this.setData({
			tabs
		})
		this.setData({
			orders: []
		});
		this.queryOrders(e.detail.index + 1)
	},
	async queryOrders(type) {
		let token = wx.getStorageSync('token');
		if (token) {
			let {
				orders
			} = await request({
				url: "/my/orders/all",
				data: {
					type
				}
			});
			this.setData({
				orders: {
					...this.data.orders,
					...orders.map(i => {
						i.create_time_cn = new Date(i.create_time * 1000).toLocaleString(); // 日期时间戳转成本地时间
						return i
					})
				}
			})
			console.log(orders);
		} else {
			wx.switchTab({
				url: '/pages/user/user'
			});
		}
	}
})