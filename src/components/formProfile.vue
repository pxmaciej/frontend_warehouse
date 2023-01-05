<template>
    <v-card>
    <v-card-title>User Profile</v-card-title>
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
                    label="Name"
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
                    label="Phone"
                    required
            ></v-text-field>

            <v-select v-if="role === 'admin'" label="Role" v-model="role" :items="roles" />
            
            <v-text-field
                    label="Password"
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
            ></v-text-field>
            
            <v-text-field
                    label="Password Confirmation"
                    v-model="password_confirmation"
                    type="password"
                    :rules="passwordRules"
            ></v-text-field>
            
            <template v-if="!isPasswordValid">
                <div class="error-message">
                    The password and password confirmation must be the same.
                </div>
            </template>
            
            <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-4"
                    @click="submit"
            >
                Submit
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
    const regex =  /^(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))[\s-]*(?:0[\s-]*[1-9]|[1-9][\s-]*\d)(?:[\s-]*\d[\s-]*){7}$/;
    return regex.test(digits);
}

const API_AUTH = 'http://127.0.0.1:8000/api/auth/';


export default {
    name: "formProfile",
    
    data: () => ({
        valid: false,
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        login: '',
        loginRules: [
            v => !!v || 'Login is required'
        ],
        phone: '',
        phoneRules: [
            v => validatePhoneNumber(v) || 'Invalid phone number'
        ],
        password: '',
        password_confirmation: '',
        passwordRules: [
            v => !!v || 'Password is required.'
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

    mounted: async function () {
        this.role = this.$store.state.role;
    },
    
    methods: {
        submit() {
            if(this.valid){
                this.editedItem.id = this.$store.state.userId;
                this.editedItem.name = this.name;
                this.editedItem.login = this.login;
                this.editedItem.phone = this.phone.substring(1);
                this.editedItem.role = this.role;
                this.editedItem.password = this.password;
                this.editedItem.password_confirmation = this.password_confirmation;
                
                axios.patch(API_AUTH+'update', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(res => {
                         console.log(res);
                         this.$emit('submit');
                     });
            }
        },
    },
    
}
</script>

<style scoped>

</style>