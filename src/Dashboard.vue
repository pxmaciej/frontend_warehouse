<template>
 <div class="container">
   <notifications position="bottom right" reverse/>
    <div class="row">
<!--        <div class="col-12">
            <sparkle-product :products="products"></sparkle-product>
        </div>-->
    </div>
    <div class="row">
        <div class="col-6">
            <crudProduct :products="products" :categories="categories" @submit="restart"></crudProduct>
        </div>
        <div class="col-6">
            <measureProduct :measureProducts="measureProducts"></measureProduct>
        </div>
    </div>
     <div class="row">
         <div class="col-12">
             <crudCategory :categories="categories" @submit="restart"></crudCategory>
         </div>
     </div>
   <div class="row">
     <div class="col-12">
       <crudOrder :orders="orders" @submit="restart"></crudOrder>
     </div>
   </div>
   <div class="row">
     <div class="col-12">
       <crudAlert :alerts="alerts" :products="products" @submit="restartAlert"></crudAlert>
     </div>
   </div>
     <div class="row">
         <div class="col-12">
             <crudStatistic :statistics="statistics" @submit="restart"></crudStatistic>
         </div>
     </div>
 </div>
</template>

<script>
import crudProduct from './components/crudProduct.vue'
import crudOrder from "./components/crudOrder"
import crudAlert from "./components/crudAlert";
import measureProduct from './components/measureProduct.vue'
import crudCategory from "./components/crudCategory";
import crudStatistic from "./components/crudStatistic";
//import sparkleProduct from "./components/sparkleProduct";
import axios from 'axios'

const API_PRODUCT = 'http://127.0.0.1:8000/api/products/index'
const API_AUTH = 'http://127.0.0.1:8000/api/auth/'
const API_ORDER = 'http://127.0.0.1:8000/api/orders/index'
const API_ALERT = 'http://127.0.0.1:8000/api/alerts/index'
const API_CATEGORY = 'http://127.0.0.1:8000/api/categories/index'
const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/index'

export default {name: 'Dashboard', components:{
		//sparkleProduct,
		crudProduct,
		measureProduct,
		crudOrder,
		crudAlert,
        crudCategory,
        crudStatistic
	}, data () {
		return{
			products: [],
            categories: [],
			orders: [],
			alerts: [],
			measureProducts: [],
            statistics: []
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
        
        axios.get(API_CATEGORY, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 this.categories = res.data
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
        
        axios.get(API_STATISTICS, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 this.statistics = res.data
             })
	},
	methods: {
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
            
            axios.get(API_CATEGORY, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
            .then(res => {
                this.categories = res.data
            })
            
            axios.get(API_STATISTICS, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
            .then(res => {
                this.statistics = res.data
            })
		},
    restartAlert() {
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
