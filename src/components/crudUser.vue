<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="users"
      class="elevation-1"
      :search="search"
    >
      <template v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))"
                v-slot:[`item.${header.value}`]="{ header, value }">
        {{ header.formatter(value) }}
      </template>
      
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Użytkownicy:</v-toolbar-title>
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Imie"
                        :counter="10"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select label="Rola" v-model="editedItem.role" :items="roles"/>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.login"
                        label="Login"
                        :rules="loginRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone"
                        type="numeric"
                        label="Telefon"
                        :rules="phoneRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.password"
                        type="password"
                        label="Hasło"
                        :rules="passwordRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.password_confirmation"
                        type="password"
                        label="Potwierdzenie hasła"
                        :rules="passwordRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <template v-if="!isPasswordValid">
                    <div class="error-message">
                      Hasła muszą być zgodne.
                    </div>
                  </template>
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
  </v-card>
</template>

<script>
import axios from "axios";
import moment from "moment";

function validatePhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters from the string
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Validate the phone number using regex
  const regex = /^(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))[\s-]*(?:0[\s-]*[1-9]|[1-9][\s-]*\d)(?:[\s-]*\d[\s-]*){7}$/;
  return regex.test(digits);
}

export default {
  name: "crudUser",
  
  data: () => ({
    dialog: false,
    users: [],
    search: '',
    roles: ['user', 'admin'],
    headers: [
      {
        text: 'Imie',
        align: 'start',
        value: 'name',
      },
      {text: 'id', value: 'id'},
      {text: 'Login', value: 'login'},
      {text: 'Telefon', value: 'phone'},
      {text: 'Rola', value: 'role'},
      {
        text: 'Data edytowania',
        value: 'updated_at', formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)
      },
      {
        text: 'Data utworzenia',
        value: 'created_at', formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)
      },
      {
        text: 'Właściwości',
        value: 'actions',
        sortable: false
      },
    ],
    selected: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      login: '',
      role: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      login: '',
      role: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
    nameRules: [
      v => !!v || 'Imie jest wymagane.',
      v => (v && v.length <= 10) || 'Imie powinno mieć mniej niż 10 znaków.',
    ],
    loginRules: [
      v => !!v || 'Login jest wymagany.'
    ],
    phoneRules: [
      v => validatePhoneNumber(v) || 'Niepoprawny numer telefonu.'
    ],
    passwordRules: [
      v => !!v || 'Hasło jest wymagane.',
      v => (v && v.length >= 6) || 'Hasło powinno mieć 6 znaków.',
    ],
    
  }),
  
  created: async function ()  {
    this.getUsers();
  },
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nowy użytkonik' : 'Edytuj użytkonika';
    },
    
    isPasswordValid() {
      return this.editedItem.password === this.editedItem.password_confirmation;
    }
  },
  
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    getUsers() {
      axios.get(
        this.$root.API_AUTH + 'users',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.users = res.data;
      });
    },

    formatDate(value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    },
    
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    
    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm(this.$root.NOTIFICATION_TEXT_CONFIRMATION) && this.users.splice(index, 1);
      
      axios.delete(
        this.$root.API_AUTH + 'destroy/' + item.id,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$notify({
                       title: 'Sukces',
                       text: 'Udało się usunąć użytkownika.',
                       type: 'success',
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
        this.editedItem.user_id =
          axios.patch(
            this.$root.API_AUTH + 'update',
            this.editedItem,
            {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
          ).then(() => {
            this.getUsers();
            
            this.$notify({
                           title: 'Success',
                           text: 'Success Update User',
                           type: 'success',
                           duration: 3000,
                           speed: 2000,
                         });
          });
      } else {
        axios.post(
          this.$root.API_AUTH + 'register',
          this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.getUsers();
          
          this.$notify({
                         title: 'Success',
                         text: 'Success Add User',
                         type: 'success',
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