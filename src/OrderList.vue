<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <crud-select-product :order="order" :products="products" @submit="getData"></crud-select-product>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crud-order-list :orderList="orderList" :order="order" :products="products" @submit="getData"></crud-order-list>
      </div>
    </div>
		<notifications position="bottom right"/>
  </div>
</template>

<script>
import crudSelectProduct from "./components/crudSelectProduct";
import crudOrderList from "./components/crudOrderList";
import axios from "axios";
import AuthService from "@/services/AuthService";

const API_PRODUCT = 'http://127.0.0.1:8000/api/products/';
const API_ORDER_LIST = 'http://127.0.0.1:8000/api/orderlists/';

export default {
  name: "OrderList",
  
  props: ['order'],
  
  components:{
    crudSelectProduct,
    crudOrderList
  },
  
  data () {
    return {
      products: [],
      orderList: []
    }
  },
	
  created: async function () {
      if (await AuthService.isAuthenticated(this)) {
          axios.get(API_PRODUCT+'index', {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
               .then(res => {
                   this.products = res.data;
               });

          axios.get(API_ORDER_LIST+'order/'+this.order['0'].id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
               .then(res => {
                   this.orderList = res.data;
               });
      }
  },
  methods: {
    getData(){
			axios.get(API_PRODUCT+'index', {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
			.then(res => {
				this.products = res.data;
			});
			
			axios.get(API_ORDER_LIST+'order/'+this.order['0'].id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
			.then(res => {
				this.orderList = res.data;
			});
    }
  }
}
</script>