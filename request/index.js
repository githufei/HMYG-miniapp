let requestCount = 0; // 同时发送的请求的个数，等所有请求都响应完毕再 hideLoadding
let request = (params) => {
	let baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
	requestCount++;
	wx.showLoading({
		title: '加载中',
		mask: true
	});
	let header = {
		...params.header
	};
	// 请求的 url 中带有 /my/ 的接口，请求头需要带上 toten
	if (params.url.includes('/my/')) {
		header.Authorization = wx.getStorageSync('token');
	}
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			url: baseUrl + params.url,
			header,
			success: ({ data }) => {
				if (data.meta.status == 200) {
					resolve(data.message);
				} else {
					wx.showModal({
						title: '提示',
						content: data.meta.msg,
						showCancel: false,
						confirmText: '确定',
						confirmColor: '#3CC51F'
					});
				}
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
export default request;
