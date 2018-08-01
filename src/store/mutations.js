const state = {
	windowWidth:0,
	footerStatus:true,
	user:null,
	isLoading: false,
	bookcaseUpdate:false
}


const mutations = {
 	SET_WINDOW_WIDTH(state,payload){
 		state.windowWidth = payload;
 	},
 	SET_FOOTER_STATUS(state,payload){
 		state.footerStatus = payload;
 	},
 	SETSTORAGE(state,payload){
 		state.user = payload;
 		sessionStorage.setItem('user',JSON.stringify(payload));
 	},
 	REMOVESTORAGE(state,payload){
 		state.user = null;
 		sessionStorage.removeItem('user');
 	},
 	UPDATELOADING(state,payload){
 		state.isLoading = payload;
 	},
 	UPDATEBOOKCASE(state,payload){
 		state.bookcaseUpdate = payload;
 	}
}

export default{
  mutations,
  state
}

