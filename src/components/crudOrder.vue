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
      :items="orders"
      :search="search"
      sort-by="dateDeliver"
      show-select
      class="elevation-1"
      :single-select=true
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Zamówienia:</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >Dodaj
              </v-btn>
              <v-btn
                color="primary"
                outlined
                class="mb-2 mr-2"
                @click.stop.prevent="addProductsToOrder(selected)"
              >Wybierz
              </v-btn>
            
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nameBuyer"
                        label="Klient"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-textarea
                        v-model="editedItem.address"
                        label="Adres Dostawy"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-checkbox
                        v-model="editedItem.status"
                        label="Status"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row justify="space-around">
                    <v-col cols="12" sm="6" md="4">
                      <h3>Data Zamówienia</h3>
                      <v-date-picker
                        v-model="editedItem.dateOrder"
                        color="green lighten-1"
                        locale="pl"
                      ></v-date-picker>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <h3>Data Dostawy</h3>
                      <v-date-picker
                        v-model="editedItem.dateDeliver"
                        color="green lighten-1"
                        locale="pl"
                      ></v-date-picker>
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
  name: 'crudOrder',
  props: ['orders'],
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'Klient',
        align: 'start',
        sortable: false,
        value: 'nameBuyer',
      },
      {
        text: 'Data zamówienia',
        value: 'dateOrder',
        dataType: "Date"
      },
      {
        text: 'Data dostawy',
        value: 'dateDeliver',
        dataType: "Date"
      },
      {text: 'Adres', value: 'address'},
      {text: 'Status', value: 'status'},
      {
        text: 'Opcje',
        value: 'actions',
        sortable: false
      },
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
      dateOrder: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateDeliver: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowe zamówienie' : 'Edytuj zamówienie';
    },
  },
  
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    addProductsToOrder(selected) {
      if (selected.length !== 0) {
        this.$router.push({name: 'orderList', params: {order: selected}});
      }
    },
    
    editItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.orders.indexOf(item);
      confirm(this.$root.NOTIFICATION_TEXT_CONFIRMATION) && this.orders.splice(index, 1);
      
      axios.delete(
        this.$root.API_ORDER + 'destroy/' + item.id,
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
          this.$root.API_ORDER + 'update/' + this.editedItem.id,
          this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'edytować')
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
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'zamówienia'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      } else {
        axios.post(
          this.$root.API_ORDER + 'store', this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'utworzyć')
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
                                   .replace('%s', 'utworzyć')
                                   .replace('%s', 'zamówienia'),
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

