<template>
  <div id="wrapper">
    <div class="d-flex flex-column " id="content-wrapper">
      <div id="content">
        <div class="container-fluid">
          <h3 class="text-dark font-weight-bold">Product</h3>
          <div class="row">
            <div class="col-md-12 col-xl-8">
              <div class="card text-white bg-primary shadow">
                <div class="card-header">
                  <h6 class="text-primary font-weight-bold m-0">New Product</h6>
                </div>
                <div class="card-body">
                  <formProduct> </formProduct>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formProduct from "./components/formProduct.vue";
import axios from "axios";

const API_AUTH = 'http://127.0.0.1:8000/api/auth/'

export default {
  name: "Product",
  components:{
    formProduct
  },
  mounted: async function () {
    if(this.$store.state.token !== '')
    {
      axios.post(API_AUTH + 'checkToken', { token : this.$store.state.token} )
           .then( res => {
             if(res.data.success){
               this.$router.push('/product');
             }
           }).catch(err => {
        this.$store.commit('clearToken');
        this.$router.push('/login');
        console.log(err.data);
      })
    }
  }
}
</script>

<style scoped>

</style>