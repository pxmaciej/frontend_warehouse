<template>
 <div class="container">
   <notifications/>
    <div class="row">
        <div class="col-12">
            <sparkle-product :products="products"></sparkle-product>
        </div>
    </div>
    <div class="row">
        <div class="col-6">
            <crudProduct v-bind:products="products" @submit="restart"></crudProduct>
        </div>
        <div class="col-6">
            <measureProduct v-bind:measureProducts="measureProducts"></measureProduct>
        </div>
    </div>
   <div class="row">
     <div class="col-12">
       <crudOrder v-bind:orders="orders" @submit="restart"></crudOrder>
     </div>
   </div>
   <div class="row">
     <div class="col-12">
       <crudAlert :alerts="alerts" :products="products" @submit="restart"></crudAlert>
     </div>
   </div>
 </div>
</template>

<script>
import crudProduct from './components/crudProduct.vue'
import crudOrder from "./components/crudOrder"
import crudAlert from "./components/crudAlert";
import measureProduct from './components/measureProduct.vue'
import sparkleProduct from "./components/sparkleProduct";
import axios from 'axios'

const API_PRODUCT = 'http://127.0.0.1:8000/api/product/index'
const API_AUTH = 'http://127.0.0.1:8000/api/auth/'
const API_ORDER = 'http://127.0.0.1:8000/api/order/index'
const API_ALERT = 'http://127.0.0.1:8000/api/alert/index'

export default {name: 'Dashboard', components:{
		sparkleProduct,
		crudProduct,
		measureProduct,
		crudOrder,
		crudAlert
	}, data () {
		return{
			products: [],
			orders: [],
			alerts: [],
			measureProducts: [],
		}
	},
	computed: {
	
	},
	mounted: async function () {
		if(this.$store.state.token !== '')
		{
			axios.post(API_AUTH + 'checkToken', {token : this.$store.state.token})
			.then(res => {
				if (res.data.success) {
					console.log('success')
				}
			}).catch(err => {
				this.$store.commit('clearToken');
			
				this.$router.push('/login');
			
				console.log(err.data);
			})
		}
		
		axios.get(API_PRODUCT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
		.then(res => {
			this.products = res.data
		
			this.selectMeasure();
			})
		
		axios.get(API_ORDER, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
		.then(res => {
			this.orders = res.data
		})
		
		axios.get(API_ALERT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
		.then(res => {
			this.alerts = res.data
			this.alerts.forEach((alert) => {
			alert.productName = this.products.find(product => product.id === alert.product_id).name
				this.$notify({
					title: 'Important message',
					text: alert.name,
					type: 'warn',
					duration: 5000,
					speed: 1000,
					})
			})
		})
	},
	methods:
		{
		selectMeasure() {
			this.products.forEach((value) => {
				if (value.amount < 100) {
					this.measureProducts.push(value);
				}
			})
		},
		restart() {
			axios.get(API_PRODUCT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
			.then(res => {
				this.products = res.data
			
				this.selectMeasure();
			})
			
			axios.get(API_ORDER, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
			.then(res => {
				this.orders = res.data
			})
			
			axios.get(API_ALERT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
			.then(res => {
				this.alerts = res.data
			
				this.alerts.forEach((alert) => {
					alert.productName = this.products.find(product => product.id === alert.product_id).name;
					this.$notify({
						title: 'Important message',
						text: alert.name,
						type: 'warn',
						duration: 10000,
						speed: 2000,
						})
				})
			})
		}
	}
}
</script>

<style>
</style>
