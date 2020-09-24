let requestCount = 0; // 同时发送的请求的个数，等所有请求都响应完毕再 hideLoadding
let request = (params) => {
	let baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
	requestCount++;
	wx.showLoading({
		title: '加载中',
		mask: true
	})
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			url: baseUrl + params.url,
			success: (result) => {
				resolve(result.data.message)
			},
			fail: (err) => reject(err),
			complete: () => {
				requestCount--;
				if (requestCount == 0) {
					wx.hideLoading();
				}
			}
		});
	});
};

// 获取用户的当前设置的 promise 形式
let getSetting = () => {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success: (result) => resolve(result),
			fail: (err) => reject(err),
		})
	})
}

// 获取用户收货地址的 promise 形式
let chooseAddress = () => {
	return new Promise((resolve, reject) => {
		wx.chooseAddress({
			success: (result) => resolve(result),
			fail: (err) => reject(err),
		});
	})
}

let openSetting = () => {
	return new Promise((resolve, reject) => {
		wx.openSetting({
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	})
}

export {
	request,
	getSetting,
	chooseAddress,
	openSetting
};