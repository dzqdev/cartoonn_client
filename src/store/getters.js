export default{
    getWidowWidth:(state)=>{
      return state.mutations.windowWidth;
    },
    getFooterStatus:(state)=>{
      return state.mutations.footerStatus;
    },
    getStorage:(state)=>{
    	if(!state.mutations.user){
    		state.mutations.user = JSON.parse(sessionStorage.getItem('user'));
    	}
    	return state.mutations.user;
    },
    getLoading:(state)=>{
      return state.mutations.isLoading;
    },
    getUpdateBookCase:(state)=>{
      return state.mutations.bookcaseUpdate;
    }
}