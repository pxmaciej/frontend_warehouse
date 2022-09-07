<template>
 <div class="container">
    <div class="row">
        <div class="col-8">
            <listProduct v-bind:products="products"></listProduct>
        </div>
        <div class="col-4">
            <measureProduct v-bind:products="products"></measureProduct>
        </div>
    </div>
 </div>
</template>

<script>
import listProduct from './listProduct.vue'
import measureProduct from './measureProduct.vue'
import axios from 'axios'
const API_PRODUCT = 'http://127.0.0.1:8000/api/product/index'


export default {
    name: 'Dashboard',
    components:{
        listProduct,
        measureProduct
    },

    data () {
        return{
        products: []
        }
    },

    async mounted(){
      console.log(this.$store.state.token)
      axios.get(API_PRODUCT, { headers: {"Authorization" : 'Bearer ' + this.$store.state.token}})
      .then( res=>{
        this.products = res.data
      })
    }
}
</script>

<style>
</style>
