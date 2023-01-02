<template>
	<v-data-table
      v-model="selected"
      :headers="headers"
      :items="products"
      show-select
      sort-by="category"
      class="elevation-1"
      :single-select=true
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>List Products:</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="success"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >Add to Order</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add to order</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.amount" label="Amount"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
<script>

import axios from "axios";

const API_ORDER_LIST = 'http://127.0.0.1:8000/api/orderlists/';
const API_PRODUCT = 'http://127.0.0.1:8000/api/products/';

export default {
  name: 'crudProduct',
  props: ['order', 'products'],
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'id', value: 'id' },
      { text: 'Category', value: 'categories' },
      { text: 'Company', value: 'company' },
      { text: 'Amount', value: 'amount' },
      { text: 'Price', value: 'price' },
    ],
    editedItem: {
      product_id: 0,
      order_id: 0,
      amount: 0,
      price: 0,
    },
    defaultItem: {
      product_id: 0,
      order_id:0,
      amount: 0,
      price: 0,
    },
		product: {
			id: 0,
			amount: 0,
		},
    selected: [],
  }),
  
  watch: {
    dialog (val) {
      val || this.close();
    },
  },
  
  methods: {
    close () {
      this.dialog = false;
    },
    
    save () {
      this.product.id = this.selected['0'].id;
      this.editedItem.order_id = this.order['0'].id;
      this.editedItem.product_id = this.selected['0'].id;
      this.editedItem.price = this.selected['0'].price * this.editedItem.amount;
      
      if (this.selected['0'].amount >= this.editedItem.amount) {
        axios.post(API_ORDER_LIST + 'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
        .then(res => {
          console.log(res.data);
          this.$emit('submit');
          
          this.$notify({
            title: 'Success',
            text: 'Success Add Product To Order',
            type: 'success',
            duration: 5000,
            speed: 2000,
          });
        });
        
        this.product.amount = this.selected['0'].amount - this.editedItem.amount;
        axios.patch(API_PRODUCT + 'update/'+this.product.id, this.product, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
        .then(res => {
          console.log(res);
        });
        
        this.close();
      } else {
        this.$notify({
          title: 'Error',
          text: 'Amount in order is greater then product amount',
          type: 'error',
          duration: 5000,
          speed: 2000,
        });
      }
    }
  }
}
</script>

