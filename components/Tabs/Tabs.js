// components/Tabs/Tabs.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		tabs: {
			type: Array,
			value: []
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		handleTabBarClick(e) {
			this.triggerEvent('changeActiveTab', {
				index: e.currentTarget.dataset.index
			})
		}
	}
})