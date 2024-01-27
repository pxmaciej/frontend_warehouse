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
      :items="alerts"
      :search="search"
      sort-by="name"
      class="elevation-1"
    >
      <template
        v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter')
              )"
        v-slot:[`item.${header.value}`]="{ header, value }"
      >
        {{ header.formatter(value) }}
      </template>
      
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Alarmy:</v-toolbar-title>
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
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.name" label="Nazwa Alarmu"></v-text-field>
                      <v-select
                        v-model="editedItem.product_id"
                        :hint="`${products.name}`"
                        :items="filteredProducts"
                        item-text="name"
                        item-value="id"
                        label="Wybierz produkt"
                        single-line
                      >
                        <template v-slot:prepend-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field v-model="selectedProduct" placeholder="Wyszukaj" @input="searchProduct"></v-text-field>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-select>
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
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: 'crudAlert',
  props: ['alerts', 'products'],
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'Nazwa alarmu',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      {text: 'Produkt', value: 'product_name'},
      {
        text: 'Opcje',
        value: 'actions',
        sortable: false
      },
    ],
    editedIndex: -1,
    editedItem: {
      product_id: 0,
      name: '',
    },
    defaultItem: {
      product_id: 0,
      name: '',
    },
    selectedProduct: ''
  }),
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowy alarm' : 'Edytuj alarm';
    },
    filteredProducts() {
      return this.products.filter((product) => product.name.toLowerCase().includes(this.selectedProduct.toLowerCase())
      );
    },
  },
  
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.alerts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.alerts.indexOf(item);
      confirm(this.$root.NOTIFICATION_TEXT_CONFIRMATION) && this.alerts.splice(index, 1);
      
      axios.delete(
        this.$root.API_ALERT + 'destroy/' + item.id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$emit('submit');
        
        this.$notify({
                       title: 'Sukces',
                       text: this.$root.NOTIFICATION_TEXT_SUCCESS.replace('%s', 'usunąć').replace('%s', 'alarm'),
                       type: 'success',
                       duration: 3000,
                       speed: 2000,
                     });
      }).catch(error => {
        console.log(error);
        this.$notify({
                       title: 'Błąd',
                       text: this.$root.NOTIFICATION_TEXT_ERROR.replace('%s', 'usunąć').replace('%s', 'alarmu'),
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
          this.$root.API_ALERT + 'update/' + this.editedItem.id,
          this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'alarm'),
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
                                   .replace('%s', 'alarmu'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      } else {
        axios.post(
          this.$root.API_ALERT + 'store', this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'utworzyć')
                                   .replace('%s', 'alarm'),
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
                                   .replace('%s', 'alarmu'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      }
      this.close();
    },
  
    searchProduct() {
      this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(this.selectedProduct.toLowerCase())
      );
    }
  }
}
</script>