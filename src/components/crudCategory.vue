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
      :search="search"
      :items="categories"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Kategorie:</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="400px">
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
                    <v-col cols="6" sm="6" md="6" >
                      <v-text-field v-model="editedItem.name" label="Nazwa"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-textarea v-model="editedItem.description" label="Opis"></v-textarea>
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
  name: 'crudCategory',
  props: ['categories'],
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'Nazwa',
        align: 'start',
        value: 'name',
      },
      {text: 'Opis', value: 'description'},
      {
        text: 'Opcje',
        value: 'actions',
        sortable: false
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      description: ''
    },
    defaultItem: {
      name: '',
      description: ''
    },
  }),
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowa kategoria' : 'Edytuj kategorie';
    },
  },
  
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.categories.indexOf(item);
      confirm(this.$root.NOTIFICATION_TEXT_CONFIRMATION) && this.categories.splice(index, 1);
      
      axios.delete(
        this.$root.API_CATEGORY + 'destroy/' + item.id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$emit('submit');
        
        this.$notify({
                       title: 'Sukces',
                       text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                 .replace('%s', 'usunąć')
                                 .replace('%s', 'kategorii'),
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
                                 .replace('%s', 'kategorii'),
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
          this.$root.API_CATEGORY + 'update/' + this.editedItem.id,
          this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'kategorii'),
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
                                   .replace('%s', 'kategorii'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      } else {
        axios.post(
          this.$root.API_CATEGORY + 'store',
          this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'utworzyć')
                                   .replace('%s', 'kategorii'),
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
                                   .replace('%s', 'kategorii'),
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

