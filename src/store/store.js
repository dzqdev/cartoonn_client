import Vue from 'vue'
import Vuex from 'vuex'

//导入模块 
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

Vue.use(Vuex);

export default new Vuex.Store({
	modules:{
		mutations
	},
	actions,
	getters
});