<template>
  <v-data-table
      :headers="headers"
      :items="orderList"
      sort-by="dateDeliver"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>List Products in order:</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>

import axios from "axios";

const API_ORDER_LIST = 'http://127.0.0.1:8000/api/orderlist/'
const API_PRODUCT = 'http://127.0.0.1:8000/api/product/'

export default {
  name: 'crudOrderList',
  props: ['orderList', 'products'],
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Your Order',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Amount', value: 'amount'},
      { text: 'Price', value: 'price' },
      { text: 'Name Buyer', value: 'NameBuyer' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: 0,
      product_id: 0,
      order_id: 0,
      amount: 0,
      price: 0
    },
    defaultItem: {
      id: 0,
      product_id: 0,
      order_id: 0,
      amount: 0,
      price: 0
    },
    product: {
      id: 0,
      amount: 0,
    }
  }),
  
  methods: {
		deleteItem(item) {
			axios.delete(API_ORDER_LIST+'destroy/'+item.id,{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
			.then(res => {
				console.log(res)
				this.$emit('submit')
				this.$notify({
					title: 'Notification',
					text: 'Success delete Item',
					type: 'success',
					duration: 5000,
					speed: 2000,
				})
			})
      this.product.id = item.product_id
      this.product.amount = item.amount + this.products.find(product => product.id === this.product.id).amount
      console.log(this.product.amount)
      axios.patch(API_PRODUCT + 'update/'+this.product.id, this.product, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
      .then(res => {
        console.log(res);
      })
		},
  }
}
</script>

