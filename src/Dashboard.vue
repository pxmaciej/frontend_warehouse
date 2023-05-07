<template>
  <div class="container">
    <notifications position="bottom right" reverse/>
    <div class="row">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn rounded v-bind="attrs" variant="outlined" v-on="on">
            Alarmy
            <v-badge :content="alerts.length" color="red"></v-badge>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(alert, index) in alerts" :key="index">
            <v-list-item-title>{{ alert.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="row">
      <div class="col-12">
        <crudProduct
          :categories="categories"
          :products="products"
          @submit="getProductByRole"
        ></crudProduct>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crudCategory :categories="categories" @submit="getCategory"></crudCategory>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crudOrder :orders="orders" @submit="getOrder"></crudOrder>
      </div>
    </div>
    <div v-if="role === 'admin'" class="row">
      <div class="col-6">
        <crudAlert
          :alerts="alerts"
          :products="products"
          @submit="getAlerts"
        ></crudAlert>
      </div>
      <div class="col-6">
        <limitAlert
          :alerts="alerts"
          :products="products"
          @submit="getAlerts"
        ></limitAlert>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crudUser v-if="role === 'admin'"></crudUser>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crudStatistic
          v-if="role === 'admin'"
          :products="products"
          :statistics="statistics"
          @submit="getStatistic"
        ></crudStatistic>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <crudLog v-if="role === 'admin'" :logs="logs"></crudLog>
      </div>
    </div>
  </div>
</template>

<script>
import crudProduct from './components/crudProduct.vue'
import crudOrder from "./components/crudOrder"
import crudAlert from "./components/crudAlert";
import crudCategory from "./components/crudCategory";
import crudStatistic from "./components/crudStatistic";
import limitAlert from "./components/limitAlert";
import crudUser from "@/components/crudUser";
import AuthService from '@/services/AuthService'
import crudLog from "@/components/crudLog";
import axios from 'axios'

export default {
  name: 'Dashboard',
  
  components: {
    crudLog,
    crudProduct,
    crudOrder,
    crudAlert,
    crudCategory,
    crudStatistic,
    limitAlert,
    crudUser,
  },
  
  data() {
    return {
      products: [],
      categories: [],
      orders: [],
      alerts: [],
      statistics: [],
      role: "",
      logs: []
    }
  },
  
  created: async function () {
    if (await AuthService.isAuthenticated(this)) {
      this.role = this.$store.state.role;
      this.getProduct();
      this.getCategory();
      this.getOrder();
      this.getAlerts();
      this.getStatistic();
      this.getLog();
    }
  },
  
  methods: {
    getProduct() {
      axios.get(
        this.$root.API_PRODUCT + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.products = res.data;
      });
    },
    
    getOrder() {
      axios.get(
        this.$root.API_ORDER + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.orders = res.data;
      });
    },
    
    getCategory() {
      axios.get(
        this.$root.API_CATEGORY + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.categories = res.data;
      });
    },
    
    
    getStatistic() {
      axios.get(
        this.$root.API_STATISTIC + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.statistics = res.data;
      });
    },
    
    getLog() {
      axios.get(
        this.$root.API_LOGS,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.logs = res.data;
      });
    },
    
    getAlerts() {
      axios.get(
        this.$root.API_ALERT + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.alerts = res.data;
      });
    },
    
    getProductByRole(){
      if (this.role === 'admin') {
        this.getProduct();
        this.getStatistic();
        this.getLog();
      }else {
        this.getProduct();
      }
    }
  }
}
</script>

<style>
</style>
