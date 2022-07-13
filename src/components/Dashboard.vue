<template>
 <div class="container">
    <div class="row">
        <div class="col-8">
            <listProduct></listProduct>
        </div>
        <div class="col-4">
            <measureProduct></measureProduct>
        </div>
    </div>
 </div>
</template>

<script>
import listProduct from './listProduct.vue'
import measureProduct from './measureProduct.vue'

export default {
    name: 'Dashboard',
    components:{
        listProduct,
        measureProduct
    },
    data () {
        return{
        
        }
    }

}
</script>

<style>

</style>
