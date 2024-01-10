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
      :items="statistics"
      :search="search"
      sort-by="created_at"
      
    >
      <template
        v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter'))"
        v-slot:[`item.${header.value}`]="{ header, value }">
        {{ header.formatter(value) }}
      </template>
      
      <template v-slot:top>
        <v-toolbar color="white" flat>
          <v-toolbar-title>Lista Statystyk:</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Dodaj
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
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nazwa statystyki"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <template v-slot:prepend-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-text-field
                              v-model="searchTerm"
                              placeholder="Wyszukaj"
                              @input="search"
                            ></v-text-field>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                      <v-select
                        v-model="editedItem.product_id"
                        :hint="`${products.name}`"
                        :items="products"
                        item-text="name"
                        item-value="id"
                        label="Wybierz produkt"
                        persistent-hint
                        single-line
                      
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.amount"
                        label="Stan magazynowy"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.netto" label="Netto"
                        type="number" @input="calculateBrutto"
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
        <v-icon class="mr-2" small @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import moment from "moment/moment";

export default {
  name: 'crudStatistic',
  props: ['statistics', 'products'],
  data: () => ({
    dialog: false,
    search: '',
    searchTerm: "",
    headers: [
      {
        text: 'Nazwa',
        align: 'start',
        value: 'name',
      },
      {text: 'Produkt', value: 'product_name'},
      {text: 'Stan magazynowy', value: 'amount'},
      {text: 'Netto', value: 'netto'},
      {text: 'VAT', value: 'vat'},
      {text: 'Brutto', value: 'brutto'},
      {
        text: 'Data utworzenie',
        value: 'created_at',
        formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)
      },
      {
        text: 'Data edytowania',
        value: 'updated_at',
        formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)
      },
      {
        text: 'Opcje',
        value: 'actions',
        sortable: false
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      product_id: 0,
      amount: 0,
      netto: 0,
      vat: 0,
      brutto: 0
    },
    defaultItem: {
      name: '',
      product_id: 0,
      amount: 0,
      netto: 0,
      vat: 0,
      brutto: 0
    },
  }),
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowa statystyka' : 'Edytuj statystykę';
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
    
    formatDate(value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    },
    
    editItem(item) {
      this.editedIndex = this.statistics.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.statistics.indexOf(item);
      confirm(this.$root.NOTIFICATION_TEXT_CONFIRMATION) && this.statistics.splice(index, 1);
      
      axios.delete(
        this.$root.API_STATISTIC + 'destroy/' + item.id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$emit('submit');
        
        this.$notify({
                       title: 'Sukces',
                       text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                 .replace('%s', 'usunąć')
                                 .replace('%s', 'statystyke'),
                       type: 'success',
                       duration: 3000,
                       speed: 2000,
                     });
      })
           .catch(error => {
             console.log(error);
             this.$notify({
                            title: 'Błąd',
                            text: this.$root.NOTIFICATION_TEXT_ERROR
                                      .replace('%s', 'usunąć')
                                      .replace('%s', 'statystyki'),
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
      if (this.editedIndex > -1) {
        axios.patch(
          this.$root.API_STATISTIC + 'update/' + this.editedItem.id,
          this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'statystykę'),
                         type: 'success',
                         duration: 3000,
                         speed: 2000,
                       });
        })
             .catch(error => {
               console.log(error);
               this.$notify({
                              title: 'Błąd',
                              text: this.$root.NOTIFICATION_TEXT_ERROR
                                        .replace('%s', 'edytować')
                                        .replace('%s', 'statystyki'),
                              type: 'error',
                              duration: 3000,
                              speed: 2000,
                            });
             });
      } else {
        axios.post(
          this.$root.API_STATISTIC + 'store', this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'utworzyć')
                                   .replace('%s', 'statystyke'),
                         type: 'success',
                         duration: 3000,
                         speed: 2000,
                       });
        })
             .catch(error => {
               console.log(error);
               this.$notify({
                              title: 'Błąd',
                              text: this.$root.NOTIFICATION_TEXT_ERROR
                                        .replace('%s', 'utworzyć')
                                        .replace('%s', 'statystyki'),
                              type: 'error',
                              duration: 3000,
                              speed: 2000,
                            });
             });
      }
      this.close();
    }
  }
}
</script>

