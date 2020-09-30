// pages/feedback/feedback.js
import request from '../../request/index.js';
import { uploadFile } from '../../utils/util.js';
Page({
	data: {
		tabs: [
			{
				text: '体验问题',
				isActive: true
			},
			{
				text: '商品、商家投诉',
				isActive: false
			}
		],
		tempFilePaths: [],
		inputVal: ''
	},
	uploadedFiles: [], // 点击提交，挨个上传图片，上传成功后的图片的外网路径信息，当 uploadedFiles 的长度和 tempFilePaths 相等时，说明图片都上传成功了，然后将 uploadedFiles 和文本域内容提交到后台
	// 页签切换事件
	changeActiveTab(e) {
		let activeIndex = e.detail.index;
		let { tabs } = this.data;
		let prevActive = tabs.findIndex((i) => i.isActive == true);
		if (activeIndex !== prevActive) {
			tabs.forEach((item, index) => {
				item.isActive = activeIndex == index;
			});
			this.setData({
				tabs
			});
		}
	},
	handleProblemType(e) {
		console.log(e);
	},
	// 文本域输入事件
	handleInput(e) {
		this.setData({
			inputVal: e.detail.value
		});
	},
	// 选择图片事件
	handleChooseImg() {
		wx.chooseImage({
			count: 9,
			sizeType: [ 'original', 'compressed' ],
			sourceType: [ 'album', 'camera' ],
			success: (result) => {
				console.log(result);
				this.setData({
					tempFilePaths: [ ...this.data.tempFilePaths, ...result.tempFilePaths ]
				});
			}
		});
	},
	// 图片移除事件
	handleRemoveImg(e) {
		let { index } = e.currentTarget.dataset;
		this.data.tempFilePaths.splice(index, 1);
		this.setData({
			tempFilePaths: this.data.tempFilePaths
		});
	},
	// 提交按钮事件--分成两个步骤：1. 将图片上传到图片服务器  2. 将图片服务器返回的信息和文本域的内容提交到后台
	handleSubmit() {
		let { inputVal, tempFilePaths } = this.data;
		if (!inputVal.trim()) {
			wx.showToast({
				title: '请输入内容',
				icon: 'none',
				mask: true
			});
			return;
		} else {
			// 将图片上传到文件服务器，上传成功后会返回图片的外网链接地址 wx.uploadFile 不支持批量上传，只能循环遍历上传
			if (tempFilePaths.length) {
				tempFilePaths.forEach(async (item) => {
					let { data } = await uploadFile({
						url: 'https://sm.ms/api/upload', // 文件服务器地址
						filePath: item,
						name: 'smfile', // 和后台约定的名称
						formData: {} // 和图片一起提交的信息
					});

					// data 中会包含图片的外网地址信息，将每个图片返回的外网信息维护为一个数组，等所有图片都上传完成后，将这个外网地址和文本框的内容一并提交到服务器
					this.uploadedFiles.push(data);
					if (this.uploadedFiles.length == tempFilePaths.length) {
						// 图片都上传完毕并返回信息了
						this.submitContent();
					}
				});
			} else {
				this.submitContent();
			}
		}
	},
	// 将图片上传后的信息和文本域的内容提交到服务器
	async submitContent() {
		let { inputVal } = this.data;
		await request({
			url: '/url',
			method: 'POST',
			data: {
				input: inputVal,
				imgs: this.uploadedFiles
			}
		});
		// 将图片和内容提交到服务器后，清空
		this.setData({
			inputVal: '',
			tempFilePaths: []
		});
		this.uploadedFiles = [];
		wx.showToast({
			title: '提交成功'
		});
	}
});
