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
      v-model="selected"
      :headers="headers"
      :items="products"
      :search="search"
      show-select
      sort-by="name"
      :single-select=true
    >
      <template v-slot:item.categories="{ item }">
        <v-chip v-for="(category, index) in item.categories" :key="index" color="primary">{{ category.name }}</v-chip>
      </template>
      
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Lista Produktów:</v-toolbar-title>
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
              >Dodaj do zamówienia
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Dodaj do zamówienia</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.amount" label="Ilość"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Anuluj</v-btn>
                <v-btn color="blue darken-1" text @click="save">Zapisz</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: 'crudProduct',
  props: ['order', 'products'],
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
      {text: 'id', value: 'id'},
      {text: 'Kategorie', value: 'categories'},
      {text: 'Firma', value: 'company'},
      {text: 'Model', value: 'model'},
      {text: 'Kod', value: 'code'},
      {text: 'Stan magazynowy', value: 'amount'},
      {text: 'Netto', value: 'netto'},
      {text: 'VAT', value: 'vat'},
      {text: 'Brutto', value: 'brutto'}
    ],
    editedItem: {
      product_id: 0,
      order_id: 0,
      amount: 0,
      netto: 0,
      vat: 0,
      brutto: 0
    },
    defaultItem: {
      product_id: 0,
      order_id: 0,
      amount: 0,
      netto: 0,
      vat: 0,
      brutto: 0
    },
    product: {
      id: 0,
      amount: 0,
    },
    selected: [],
  }),
  
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  
  methods: {
    close() {
      this.dialog = false;
    },
    
    save() {
      this.product.id = this.selected['0'].id;
      this.editedItem.order_id = this.order['0'].id;
      this.editedItem.product_id = this.selected['0'].id;
      this.editedItem.netto = this.selected['0'].netto * this.editedItem.amount;
      this.editedItem.vat = this.selected['0'].vat;
      
      if (this.editedItem.vat === 'zw') {
        this.editedItem.brutto = this.editedItem.netto;
      } else {
        const netto = parseFloat(this.editedItem.netto);
        const vat = parseFloat(this.editedItem.vat);
        const brutto = netto * (1 + vat / 100);
        this.editedItem.brutto = brutto.toFixed(2);
      }
      
      if (this.selected['0'].amount >= this.editedItem.amount) {
        axios.post(
          this.$root.API_ORDER_LIST + 'store',
          this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'dodać')
                                   .replace('%s', 'produkt do zamówienia'),
                         type: 'success',
                         duration: 3000,
                         speed: 2000,
                       });
        }).catch(error => {
          console.log(error);
          this.$notify({
                         title: 'Błąd',
                         text: this.$root.NOTIFICATION_TEXT_ERROR
                                   .replace('%s', 'dodać')
                                   .replace('%s', 'produktu do zamówienia'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
        
        this.product.amount = this.selected['0'].amount - this.editedItem.amount;
        axios.patch(
          this.$root.API_PRODUCT + 'update/' + this.product.id,
          this.product, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        );
        
        this.close();
      } else {
        this.$notify({
                       title: 'Błąd',
                       text: 'Ilość w zamówieniu jest większa niż ilość dostępnego produktu',
                       type: 'error',
                       duration: 3000,
                       speed: 2000,
                     });
      }
    }
  }
}
</script>

