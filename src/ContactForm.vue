<template>
  <div class="container">
    <notifications position="bottom right" reverse/>
    <v-card
      class="mx-auto my-12"
      max-width="374"
    >
      <v-card-title>Send Email</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="editedItem.name"
            name="name"
            :counter="10"
            :rules="nameRules"
            label="Imie"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="editedItem.email"
            :rules="emailRules"
            name="email"
            label="E-mail"
            required
          ></v-text-field>
          <v-textarea
            :rules="messageRules"
            outlined
            auto-grow
            rows="1"
            row-height="15"
            v-model="editedItem.message"
            name="message"
            label="Wiadomość"
            required
          ></v-textarea>
          
          <vue-recaptcha sitekey="6LfeGlkpAAAAAETnfkAePqb5DhDwZOnCBSEneOrL" @verify="noRobot"></vue-recaptcha>
          
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="sendEmail"
          >
            Submit
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  name: "ContactForm",
  
  components: {
    VueRecaptcha
  },
  
  data() {
    return {
      recaptcha: false,
      valid: false,
      nameRules: [
        v => !!v || 'Imie jest wymagane',
        v => (v && v.length <= 10) || 'Dopuszczalna ilość znaków 10',
      ],
      emailRules: [
        v => !!v || 'E-mail jest wymagany',
        v => /.+@.+\..+/.test(v) || 'E-mail musi być poprawny',
      ],
      messageRules: [
         v => !!v || 'Treść jest wymagana',
         v => (v && v.length <= 150) || 'Dopuszczalna ilość znaków 150',
      ],
      editedItem: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  
  methods: {
    noRobot() {
      this.recaptcha = true;
    },
    sendEmail() {
      if (this.valid && this.recaptcha) {
        try {
          emailjs.sendForm(
            'service_k6m8klr',
            'template_404aweh',
            this.$refs.form.$el,
            '0SJDaSwBwKN3SxYz1');
        } catch (error) {
          console.log({error})
          this.$notify({
                         title: 'Error',
                         text: 'Something wrong!',
                         type: 'error',
                         duration: 3000,
                         speed: 1000,
                       });
        }  
        this.$notify({
                       title: 'Success',
                       text: 'Success send Message',
                       type: 'success',
                       duration: 3000,
                       speed: 1000,
                     });
      } else {
        this.$notify({
                       title: 'Warning',
                       text: 'All fields are required',
                       type: 'warn',
                       duration: 3000,
                       speed: 1000,
                     });
      }
      this.editedItem.name = '';
      this.editedItem.email = '';
      this.editedItem.message = '';
    }
  }
}
</script>

<style scoped>
</style>