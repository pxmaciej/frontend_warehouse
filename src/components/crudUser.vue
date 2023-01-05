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
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>List Users:</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                            >New User</v-btn>
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
                                                    label="Name"
                                                    :counter="10"
                                                    :rules="nameRules"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select label="Role" v-model="editedItem.role" :items="roles"/>
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
                                                    label="Phone"
                                                    :rules="phoneRules"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                    v-model="editedItem.password"
                                                    type="password"
                                                    label="password"
                                                    :rules="passwordRules"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                    v-model="editedItem.password_confirmation"
                                                    type="password"
                                                    label="password_confirmation"
                                                    :rules="passwordRules"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <template v-if="!isPasswordValid">
                                        <div class="error-message">
                                            The password and password confirmation must be the same.
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
import moment from 'moment';

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
    name: "crudUser",
    
    data: () => ({
        dialog: false,
        users: [],
        search: '',
        roles: ['user', 'admin'],
        headers: [
            {
                text: 'Name',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'id', value: 'id' },
            { text: 'Login', value: 'login' },
            { text: 'Phone', value: 'phone' },
            { text: 'Role', value: 'role' },
            { text: 'Updated Date', value: 'updated_at',},
            { text: 'Created Date ', value: 'created_at' },
            { text: 'Actions', value: 'actions', sortable: false },
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
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        loginRules: [
            v => !!v || 'Login is required'
        ],
        phoneRules: [
            v => validatePhoneNumber(v) || 'Invalid phone number'
        ],
        passwordRules: [
            v => !!v || 'Password is required.'
        ],
        
    }),
    
    mounted() {
       this.getUsers();
    },

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New User' : 'Edit User';
        },
        
        isPasswordValid() {
            return this.editedItem.password === this.editedItem.password_confirmation;
        }
    },

    watch: {
        dialog (val) {
            val || this.close();
        },
    },
    methods: {
        formatDate(value) {
            return moment(String(value)).format('MM/DD/YYYY hh:mm')
        },
        
        getUsers() {
            axios.get(API_AUTH+'users',{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.users = res.data;
                 });
        },
        
        editItem (item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem (item) {
            const index = this.users.indexOf(item);
            confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1);
            axios.delete(API_AUTH+'destroy/'+item.id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     console.log(res);
                 });
        },

        close () {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        save () {
            if (this.editedIndex > -1) {
                this.editedItem.user_id =
                axios.patch(API_AUTH+'update', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(res => {
                         console.log(res);
                         this.getUsers();
                     });
            } else {
                axios.post(API_AUTH+'register', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(res => {
                         console.log(res);
                         this.getUsers();
                     });
            }
            this.close();
        }
    }
}
</script>

<style scoped>

</style>