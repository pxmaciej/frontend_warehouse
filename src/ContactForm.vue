<template>
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
                        label="Name"
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
                        outlined
                        auto-grow
                        rows="1"
                        row-height="15"
                        v-model="editedItem.message"
                        name="message"
                        label="Message"
                        required
                ></v-textarea>
                
                <vue-recaptcha sitekey="6LcT39MjAAAAAChqO4bbh2qTW1Ica_9X2-4IowBp"></vue-recaptcha>
                
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
</template>

<script>
import emailjs from 'emailjs-com';
import { VueRecaptcha } from 'vue-recaptcha';

export default {
    name: "ContactForm",
    
    components:{
        VueRecaptcha
    },
    
    data() {
        return {
            valid: false,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            editedItem: {
                name: '',
                email: '',
                message: ''
            }
        }
    },
    
    methods: {
        sendEmail() {
            if(this.valid) {
                try {
                    emailjs.sendForm(
                        'service_k6m8klr',
                        'template_404aweh',
                        this.$refs.form.$el,
                        '0SJDaSwBwKN3SxYz1');
                } catch(error) {
                    console.log({error})
                    this.$notify({
                        title: 'Error',
                        text: 'Something wrong!',
                        type: 'error',
                        duration: 3000,
                        speed: 1000,
                    });
                }
                
                this.name = '';
                this.email = '';
                this.message = '';
                
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
        }
    }
}
</script>

<style scoped>
</style>