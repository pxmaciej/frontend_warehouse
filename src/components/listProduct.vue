<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Category</th>
                    <th class="text-left">Company</th>
                    <th class="text-left">Amount</th>
                    <th class="text-left">Price</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.company }}</td>
                    <td>{{ product.amount }}</td>
                    <td>{{ product.price }}</td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
import axios from 'axios';
const API_PRODUCT = 'http://127.0.0.1:8000/api/product/index';
export default {
  name: 'ListProduct',
  data(){
    return{
        products:[]
    }
  },
  mounted(){
    axios.get(API_PRODUCT, { token : this.$store.state.token})
    .then( res=>{
        this.products = res.data
    })
  }

}
</script>

<style>

</style>
