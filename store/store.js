// 1. 导入 Vue 和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 导入用户的 vuex 模块
import moduleUser from './user.js'
import moduleCart from './cart.js'

// 2. 将 Vuex 安装为 Vue 的插件
Vue.use(Vuex)

// 3. 创建 Store 的实例对象
const store = new Vuex.Store({
  // TODO：挂载 store 模块
  modules: {
	// 挂载用户的 vuex 模块，访问路径为 m_user
	m_user: moduleUser,
	// 挂载用户的 vuex 模块，访问路径为 m_cart
	m_cart: moduleCart,
  },
})

// 4. 向外共享 Store 的实例对象
export default store