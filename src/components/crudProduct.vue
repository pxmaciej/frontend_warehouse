<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        hide-details
        label="Wyszukaj"
        single-line
      ></v-text-field>
    </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="products"
      :search="search"
    >
      <template v-slot:item.categories="{ item }">
        <v-chip v-for="(category, index) in item.categories" :key="index" color="primary">
          {{ category.name }}
        </v-chip>
      </template>
      
      <template v-slot:top>
        <v-toolbar color="white" flat>
          <v-toolbar-title>Magazyn:</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          
          <v-spacer></v-spacer>
          
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >Dodaj
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field v-model="editedItem.name" label="Nazwa"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedItem.categories"
                        :items="categories"
                        item-text="name"
                        item-value="id"
                        label="Kategorie"
                        multiple
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field v-model="editedItem.company" label="Firma"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.amount"
                        label="Stan magazynowy"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.model"
                        label="Model"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.code"
                        label="Code"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.netto"
                        label="Netto"
                        type="number"
                        @input="calculateBrutto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedItem.vat"
                        :items="['23', '8', '5', '0', 'zw']"
                        item-value="VAT"
                        label="VAT"
                        @change="calculateBrutto"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.brutto"
                        label="Brutto"
                        type="number"
                      ></v-text-field>
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
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          small
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
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: 'crudProduct',
  props: ['products', 'categories'],
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'Nazwa',
        align: 'start',
        value: 'name',
      },
      {text: 'id', value: 'id'},
      {text: 'Firma', value: 'company'},
      {text: 'Model', value: 'model'},
      {text: 'Kod', value: 'code'},
      {text: 'Kategorie', value: 'categories'},
      {text: 'Stan magazynowy', value: 'amount'},
      {text: 'Netto', value: 'netto'},
      {text: 'VAT', value: 'vat'},
      {text: 'Brutto', value: 'brutto'},
      {
        text: 'Opcje',
        value: 'actions',
        sortable: false
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      categories: [],
      company: '',
      model: '',
      code: 0,
      amount: 0,
      netto: 0,
      vat: 0,
      brutto: 0,
    },
    defaultItem: {
      name: '',
      categories: [],
      company: '',
      model: '',
      code: 0,
      amount: 0,
      netto: 0,
      vat: 0,
      brutto: 0,
    },
  }),
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowy produkt' : 'Edytuj produkt';
    },
  },
  
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    calculateBrutto() {
      if (this.editedItem.vat === 'zw') {
        this.editedItem.brutto = this.editedItem.netto;
      } else {
        const netto = parseFloat(this.editedItem.netto);
        const vat = parseFloat(this.editedItem.vat);
        const brutto = netto * (1 + vat / 100);
        this.editedItem.brutto = brutto.toFixed(2);
      }
    },
    
    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      
      this.statisticItem = Object.assign({}, item);
      this.statisticItem.name = 'Edited product';
      this.statisticItem.product_id = item.id;
      
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.products.indexOf(item);
      confirm(this.$root.NOTIFICATION_TEXT_CONFIRMATION) && this.products.splice(index, 1);
      axios.delete(
        this.$root.API_PRODUCT + 'destroy/' + item.id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$emit('submit');
        
        this.$notify({
                       title: 'Sukces',
                       text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                 .replace('%s', 'usunąć')
                                 .replace('%s', 'produktu'),
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
                                 .replace('%s', 'produktu'),
                       type: 'error',
                       duration: 3000,
                       speed: 2000,
                     });
      });
    },
    
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    
    save() {
      if (this.editedIndex > -1 && this.editedItem.amount > 0) {
        axios.patch(
          this.$root.API_PRODUCT + 'update/' + this.editedItem.id,
          this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'produkt'),
                         type: 'success',
                         duration: 3000,
                         speed: 2000,
                       });
        }).catch(error => {
          console.log(error);
          this.$notify({
                         title: 'Błąd',
                         text: this.$root.NOTIFICATION_TEXT_ERROR
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'produktu'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      } else if (this.editedItem.amount > 0) {
        axios.post(
          this.$root.API_PRODUCT + 'store',
          this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'utworzyć')
                                   .replace('%s', 'produkt'),
                         type: 'success',
                         duration: 3000,
                         speed: 2000,
                       });
        }).catch(error => {
          console.log(error);
          this.$notify({
                         title: 'Błąd',
                         text: this.$root.NOTIFICATION_TEXT_ERROR
                                   .replace('%s', 'utworzyć')
                                   .replace('%s', 'produktu'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      } else {
        this.$notify({
                       title: 'Błąd',
                       text: 'Ilość nie może być mniejsza niż 0',
                       type: 'error',
                       duration: 3000,
                       speed: 2000,
                     });
      }
      this.close();
    },
  }
}
</script>