// 获取用户的当前设置的 promise 形式
let getSetting = () => {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	});
};

// 获取用户收货地址的 promise 形式
let chooseAddress = () => {
	return new Promise((resolve, reject) => {
		wx.chooseAddress({
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	});
};

let openSetting = () => {
	return new Promise((resolve, reject) => {
		wx.openSetting({
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	});
};

let login = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	});
};

let requestPayment = (params) => {
	return new Promise((resolve, reject) => {
		wx.requestPayment({
			...params,
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	});
};

let showToast = (params) => {
	return new Promise((resolve) => {
		wx.showToast({
			...params,
			success: (result) => resolve(result)
		});
	});
};

let showModal = (params) => {
	return new Promise((resolve) => {
		wx.showModal({
			...params,
			success: (result) => resolve(result)
		});
	});
};

let uploadFile = (params) => {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			...params,
			success: (result) => resolve(result),
			fail: (err) => reject(err)
		});
	});
};

export { getSetting, chooseAddress, openSetting, showToast, showModal, login, requestPayment, uploadFile };
