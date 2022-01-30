import Vue from 'vue'
import App from './App'
//导入 store 的实例对象
import store from './store/store.js'
// import {mapMutations} from 'vuex'
import cuCustom from './colorui/components/cu-custom.vue'
import API_URL from './util/api.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

uni.$url = API_URL

Vue.component('cu-custom',cuCustom)


uni.$http = $http

// 请求的根路径
// $http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })

  // 判断当前请求的是否为有权限的接口
  // if (options.url.indexOf('/') !== -1) {
  //   options.header = {
  //     'Authorization': "DriverBearer " + store.state.m_user.token
  //   }
  // }

}

// 响应拦截器
$http.afterRequest = function(res) {
	
  uni.hideLoading()
  
  	let code = res.data.code;

  	if(code == 401) {
		store.state.m_user.token = '';
		store.state.m_user.userinfo = {};

		// 询问用户是否登录
		uni.showModal({
			title: '提示',
			content: '请先登录吗？',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					// 用户确认了登录的操作
					uni.navigateTo({
						url: '/pages/index/index'
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
		
		return
  	}
	
	if(code == 201) {
		return uni.$showMsg(res.data.msg);
	}
	
	if(code == 403) {
		return uni.$showMsg(res.data.msg);
	}
	
	if(code == 404) {
		return uni.$showMsg(res.data.msg);
	}
	
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
})
app.$mount()
