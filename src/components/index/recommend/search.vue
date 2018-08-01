<template>
	<div id="search">
		<search
	      @result-click="resultClick"
	      @on-submit="getResult"
	      :results="results"
	      v-model="value"
	      placeholder="输入作品名"
	      position="absolute"
	      top="0px"
	      @on-cancel="onCancel"
	      ref="search"></search>
	</div>
</template>

<script>
import { Search } from 'vux'
	export default{
		data(){
			return{
				value:'',
				results: []
			}
		},
		components:{
			Search
		},
		methods:{
			resultClick (item) {
			    this.$router.push({
		        	path: '/cartoonDetail/' + item._id,
		        })
			},
		    onSubmit () {
			    this.$refs.search.setBlur();
			    this.$vux.toast.show({
				    type: 'text',
				    position: 'top',
				    text: 'on submit'
			    })
		    },
		    onCancel () {
		    	this.$router.back(-1);
		    },
		    getResult (val) {
				var _this = this;
				if(val != ''){
					_this.axios.get('/cartoon/search/' + val, {
			          params: {
			          }
			        })
			        .then(function (response) {
			        	console.log(response);
			        	for(let i = 0; i < response.data.msg.text.length; i++){
			        		_this.results.push({
			        			title:response.data.msg.text[i].cartoon_name,
			        			_id:response.data.msg.text[i]._id
			        		});	
			        	}
			        	/**/
			        })
			        .catch(function (err) {
			          console.log("err: " + err);
			      	});
				}
			}
		},
		mounted(){
			this.$refs.search.setFocus()
		}
	}
</script>

<style scoped>
	
</style>