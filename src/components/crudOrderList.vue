<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Wyszukaj"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="orderList"
      :search="search"
      sort-by="dateDeliver"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Produkty w zamówieniu:</v-toolbar-title>
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
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: 'crudOrderList',
  props: ['orderList', 'products'],
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'Nazwa',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      {text: 'Ilość', value: 'amount'},
      {text: 'Netto', value: 'netto'},
      {text: 'Vat', value: 'vat'},
      {text: 'Brutto', value: 'brutto'},
      {text: 'Klient', value: 'nameBuyer'},
      {text: 'Opcje', value: 'actions', sortable: false},
    ],
    product: {
      id: 0,
      amount: 0,
    }
  }),
  
  methods: {
    deleteItem(item) {
      axios.delete(
        this.$root.API_ORDER_LIST + 'destroy/' + item.id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$emit('submit');
        
        this.$notify({
                       title: 'Sukces',
                       text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                 .replace('%s', 'usunąć')
                                 .replace('%s', 'zamówienia'),
                       type: 'success',
                       duration: 3000,
                       speed: 2000,
                     });
      }).catch(error => {
        console.log(error);
        this.$notify({
                       title: 'Błąd',
                       text: this.$root.NOTIFICATION_TEXT_ERROR
                                 .replace('%s', 'usunąć')
                                 .replace('%s', 'zamówienia'),
                       type: 'error',
                       duration: 3000,
                       speed: 2000,
                     });
      });
      
      this.product.id = item.product_id;
      this.product.amount = item.amount + this.products.find(product => product.id === this.product.id).amount;
      
      axios.patch(
        this.$root.API_PRODUCT + 'update/' + this.product.id,
        this.product,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      )
    }
  }
}
</script>

