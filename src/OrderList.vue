<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <crud-select-product
          :order="order"
          :products="products"
          @submit="getData"
        ></crud-select-product>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crud-order-list
          :orderList="orderList"
          :order="order"
          :products="products"
          @submit="getData"
        ></crud-order-list>
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

export default {
  name: "OrderList",
  
  props: ['order'],
  
  components: {
    crudSelectProduct,
    crudOrderList
  },
  
  data() {
    return {
      products: [],
      orderList: []
    }
  },
  
  created: async function () {
    if (await AuthService.isAuthenticated(this)) {
      this.getData();
    }
  },
  
  methods: {
    getData() {
      axios.get(
        this.$root.API_PRODUCT + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.products = res.data;
      });
      
      axios.get(
        this.$root.API_ORDER_LIST + 'order/' + this.order['0'].id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.orderList = res.data;
      });
    }
  }
}
</script>