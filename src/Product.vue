<template>
    <div class="card">
        <div class="card-body">
            <h2 class="card-title">Product Detail</h2>
            {{showProduct}}
        </div>
    </div>
</template>

<script>
import axios from "axios";

const API_PRODUCT_SHOW = 'http://127.0.0.1:8000/api/products/show/'

export default {
    name: "Product",

    props: ['product'],

    data () {
        return {
            showProduct: [],
        }
    },
    
    mounted: async function () {
        axios.get(API_PRODUCT_SHOW+this.product['0'].id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 this.showProduct = res.data
             })
    },
}
</script>