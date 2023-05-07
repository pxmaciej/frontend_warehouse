<template>
  <v-card>
    <v-card-title>Edytuj Profil</v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="name"
          :counter="10"
          :rules="nameRules"
          label="Imie"
          required
        ></v-text-field>
        
        <v-text-field
          v-model="login"
          :rules="loginRules"
          label="Login"
          required
        ></v-text-field>
        
        <v-text-field
          v-model="phone"
          :rules="phoneRules"
          label="Telefon"
          required
        ></v-text-field>
        
        <v-select v-if="role === 'admin'" label="Rola" v-model="role" :items="roles"/>
        
        <v-text-field
          label="Hasło"
          v-model="password"
          type="password"
          :rules="passwordRules"
        ></v-text-field>
        
        <v-text-field
          label="Potwierdzenie hasła"
          v-model="password_confirmation"
          type="password"
          :rules="passwordRules"
        ></v-text-field>
        
        <template v-if="!isPasswordValid">
          <div class="error-message">
            Hasła muszą być takie same.
          </div>
        </template>
        
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submit"
        >
          Zapisz
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";

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
  name: "formProfile",
  
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      v => !!v || 'Imie jest wymagane',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    login: '',
    loginRules: [
      v => !!v || 'Login jest wymagany'
    ],
    phone: '',
    phoneRules: [
      v => validatePhoneNumber(v) || 'Nieprawidłowy numer telefonu'
    ],
    password: '',
    password_confirmation: '',
    passwordRules: [
      v => !!v || 'Hasło wymagane'
    ],
    roles: ['user', 'admin'],
    role: '',
    editedItem: {
      id: '',
      name: '',
      login: '',
      phone: '',
      password: '',
      password_confirmation: ''
    },
  }),
  
  computed: {
    isPasswordValid() {
      return this.password === this.password_confirmation;
    }
  },
  
  created: async function () {
    this.role = this.$store.state.role;
  },
  
  methods: {
    submit() {
      if (this.valid) {
        this.editedItem.id = this.$store.state.userId;
        this.editedItem.name = this.name;
        this.editedItem.login = this.login;
        this.editedItem.phone = this.phone.substring(1);
        this.editedItem.role = this.role;
        this.editedItem.password = this.password;
        this.editedItem.password_confirmation = this.password_confirmation;
        
        axios.patch(
          this.$root.API_AUTH + 'update',
          this.editedItem,
          {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
        ).then(() => {
          this.$emit('submit');
          
          this.$notify({
                         title: 'Sukces',
                         text: this.$root.NOTIFICATION_TEXT_SUCCESS
                                   .replace('%s', 'edytować')
                                   .replace('%s', 'profil'),
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
                                   .replace('%s', 'profilu'),
                         type: 'error',
                         duration: 3000,
                         speed: 2000,
                       });
        });
      }
    },
  },
  
}
</script>

<style scoped>

</style>