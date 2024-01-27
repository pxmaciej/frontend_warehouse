<template>
  <div class="container">
     <notifications position="bottom right" reverse/>
    <div class="row">
      <div class="col-6">
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
    <div class="col-6">
       <v-btn block size="x-large" @click="checkProductSetAlert">Sprawdź Alerty</v-btn>
    </div>
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
        <crudOrder :orders="orders" :products="products" @submit="getProductAndOrder"></crudOrder>
      </div>
    </div>
    <div v-if="role === 'admin'" class="row">
      <div class="col-md-6 col-sm-12">
        <crudAlert
          :alerts="alerts"
          :products="products"
          @submit="getAlert"
        ></crudAlert>
      </div>
      <div class="col-md-6 col-sm-12">
        <limitAlert
          :alerts="alerts"
          :products="products"
          :limit="limit"
          @submit="getLimit"
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
      logs: [],
      limit: [],
      alert:{
        name: "",
        product_id: 0
      }
    }
  },
  
  created: async function () {
    if (await AuthService.isAuthenticated(this)) {
      this.getProductByRole();
      this.getCategory();
      this.getOrder();
      this.getAlert();
      this.getLimit();
      setInterval(() => {
        this.checkProductSetAlert();
      }, 60 * 60 * 1000);
    }
  },
  
  methods: {
    getLimit() {
      axios.get(
        this.$root.API_ALERT + 'limit',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.limit = res.data;
      }).catch(error => {
        console.log(error);
      });
    },

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
    
    getLog() {
      axios.get(
        this.$root.API_LOG,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.logs = res.data;
      });
    },
    
    getAlert() {
      axios.get(
        this.$root.API_ALERT + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.alerts = res.data;
      });
    },
    
    setRole() {
      this.role = this.$store.state.role;
    },
    
    getProductByRole() {
      this.setRole()
      if (this.role === 'admin') {
        this.getProduct();
        this.getLog();
      } else {
        this.getProduct();
      }
    },

    getProductAndOrder() {
      this.getProduct();
      this.getOrder();
    },
    async checkProductSetAlert() {
      this.products.forEach((product) => {
        const indexOfProductInAlerts = this.alerts.some(alert => alert.product_id === product.id);
      
        if (product.amount <= this.limit && !indexOfProductInAlerts) {
          this.alert.name = product.name;
          this.alert.product_id = product.id;
          
          axios.post(
            this.$root.API_ALERT + 'store', this.alert,
            {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
          ).then(() => {
            this.$emit('submit');
          }).catch(error => {
            console.log(error);
          });
        }
      });
      this.getAlert();
    }
  }
}
</script>