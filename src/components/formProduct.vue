<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
        v-model="product.name"
        :counter = "250"
        :rules="requireRule"
        label="Name"
        required
    ></v-text-field>
    
    <v-text-field
        v-model="product.category"
        :counter = "250"
        :rules="requireRule"
        label="Category"
        required
    ></v-text-field>
    
    <v-text-field
        v-model="product.company"
        :counter = "250"
        :rules="requireRule"
        label="Company"
        required
    ></v-text-field>
    
    <v-text-field
        v-model= "product.amount"
        :counter = "1"
        label="Amount"
        required
    ></v-text-field>
  
    <v-text-field
        v-model="product.price"
        :counter = "1"
        label="Price"
        required
    ></v-text-field>
    
    <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">Send</v-btn>
    
    <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>
  </v-form>
</template>

<script>
import axios from "axios";

const API_PRODUCT = 'http://127.0.0.1:8000/api/product/'

export default {
  name: "formProduct",
	components: {

	},
  data: () => ({
    valid: true,
    product: {
      name: '' ,
      category: '' ,
      company: '' ,
      amount: '' ,
      price: '' ,
    },
    requireRule: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 250) || 'Name must be less than 5 characters',
    ]
  }),
  methods: {
    submit() {
      this.$refs.form.validate()
      axios.post(API_PRODUCT+'store', this.product, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
           .then(res => {
              this.reset();
              console.log(res);
           })
    },
    reset () {
      this.$refs.form.reset()
    },
  }
}

</script>

<style scoped>

</style>