<template>
  <v-data-table
      :headers="headers"
      :items="statistics"
      sort-by="category"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>List Statistics:</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Product name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.product_id" label="Company"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.amount" label="Amount"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.price" label="Price"></v-text-field>
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

const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/';

export default {
  name: 'crudStatistic',
  props: ['statistics'],
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Product', value: 'product_id' },
      { text: 'Amount', value: 'amount' },
      { text: 'Price', value: 'price' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      product_id: 0,
      amount: 0,
      price: 0,
    },
    defaultItem: {
      name: '',
      product_id: 0,
      amount: 0,
      price: 0,
    },
  }),
  
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.statistics.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    
    deleteItem (item) {
      const index = this.statistics.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.statistics.splice(index, 1)
      axios.delete(API_STATISTICS+'destroy/'+item.id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
           .then(res => {
             console.log(res);
             this.$emit('submit')
           })
    },
    
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    
    save () {
      if (this.editedIndex > -1) {
        axios.patch(API_STATISTICS+'update/' + this.editedItem.id, this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
               console.log(res);
               this.$emit('submit')
             })
      } else {
        axios.post(API_STATISTICS+'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
               console.log(res);
               this.$emit('submit')
             })
      }
      this.close()
    }
  }
}
</script>

