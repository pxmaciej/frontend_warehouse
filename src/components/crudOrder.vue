<template>
  <v-data-table
      v-model="selected"
      :headers="headers"
      :items="orders"
      sort-by="dateDeliver"
      show-select
      class="elevation-1"
      :single-select=true
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>List Orders:</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >New Order</v-btn>
            <v-btn
                color="success"
                dark
                class="mb-2 mr-2"
                @click.stop.prevent="addProductsToOrder(selected)"
            >Show</v-btn>
            
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nameBuyer" label="Buyer name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-textarea v-model="editedItem.address" label="Address"></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                      <v-checkbox
                              v-model="editedItem.status"
                              :label="'status Deliver'"
                      ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row justify="space-between">
                    <div class="subheading">
                    Date Order
                    </div>
                    <v-date-picker v-model="editedItem.dateOrder" color="green lighten-1"></v-date-picker>
                    <div class="subheading">
                      Date Deliver
                    </div>
                    <v-date-picker v-model="editedItem.dateDeliver" color="green lighten-1"></v-date-picker>
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
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
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

const API_ORDER = 'http://127.0.0.1:8000/api/orders/';

export default {
  name: 'crudOrder',
  props: ['orders'],
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Buyer Name',
        align: 'start',
        sortable: false,
        value: 'nameBuyer',
      },
      { text: 'Order Date', value: 'dateOrder',  dataType: "Date" },
      { text: 'Deliver Date', value: 'dateDeliver',  dataType: "Date" },
      { text: 'Address', value: 'address'},
      { text: 'Status', value: 'status'},
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    selected: [],
    editedIndex: -1,
    editedItem: {
      nameBuyer: '',
      status: false,
      address: '',
      dateOrder: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateDeliver: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultItem: {
      nameBuyer: '',
      status: false,
      address: '',
      ateOrder: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateDeliver: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),
  
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Order' : 'Edit Order';
    },
  },
  
  watch: {
    dialog (val) {
      val || this.close();
    },
  },
  methods: {
    addProductsToOrder(selected) {
      if (selected.length !== 0) {
        this.$router.push({name: 'orderList', params: { order: selected }});
      }
    },
    
    editItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.orders.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.orders.splice(index, 1);
      axios.delete(API_ORDER+'destroy/'+item.id,{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
      .then(res => {
        console.log(res);
        this.$emit('submit');
      });
    },
    
    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    
    save () {
      if (this.editedIndex > -1) {
        axios.patch(API_ORDER+'update/'+this.editedItem.id, this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
               console.log(res);
               this.$emit('submit');
             });
      } else {
        axios.post(API_ORDER+'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
               console.log(res);
               this.$emit('submit');
             });
      }
      this.close();
    }
  }
}
</script>

