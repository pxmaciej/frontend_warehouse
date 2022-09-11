<template>
 <div class="container">
    <div class="row">
        <div class="col-6">
            <listProduct v-bind:products="products"></listProduct>
        </div>
        <div class="col-6">
            <measureProduct v-bind:measureProducts="measureProducts"></measureProduct>
        </div>
    </div>
 </div>
</template>

<script>
import listProduct from './components/listProduct.vue'
import measureProduct from './components/measureProduct.vue'
import axios from 'axios'

const API_PRODUCT = 'http://127.0.0.1:8000/api/product/index'
const API_AUTH = 'http://127.0.0.1:8000/api/auth/'


export default {
    name: 'Dashboard',
    components:{
        listProduct,
        measureProduct
    },

    data () {
        return{
        products: [],
        measureProducts: []
        }
    },

  mounted: async function () {
    if (this.$store.state.token !== '') {
      axios.post(API_AUTH + 'checkToken', {token: this.$store.state.token})
          .then(res => {
            if (res.data.success) {
              this.$router.push('/dashboard');
            } else {
              this.$store.commit('clearToken');
            }
          })
    }
    axios.get(API_PRODUCT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
        .then(res => {
          this.products = res.data
          this.selectMeasure();
        })
  },
  methods: {
      selectMeasure() {
        this.products.forEach((value) => {
          if (value.amount < 100) {
            this.measureProducts.push(value);
          }
        });
      }
  }
}
</script>

<style>
</style>
