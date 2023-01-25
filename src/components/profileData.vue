<template>
    <v-card>
        <v-card-title>User Profile</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item>
                    <v-list-item>
                            <v-list-item-icon>
                                <v-icon v-text="icons.mdiAccount"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Name:</v-list-item-title>
                            <v-list-item-subtitle>{{ name }}</v-list-item-subtitle>
                        
                    </v-list-item>
                </v-list-item>
                <v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon v-text="icons.mdiLoginVariant"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Login:</v-list-item-title>
                        <v-list-item-subtitle>{{ login }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list-item>
                <v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon v-text="icons.mdiPhone"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Phone:</v-list-item-title>
                        <v-list-item-subtitle>{{ phone }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>

import axios from "axios";
import { mdiAccount, mdiLoginVariant, mdiPhone } from "@mdi/js";

const API_AUTH = 'http://127.0.0.1:8000/api/auth/';
export default {
    name: "profileData",
    
    data() {
        return {
            name: '',
            login: '',
            phone: '',
            icons: {
                mdiAccount,
                mdiLoginVariant,
                mdiPhone
            }
        }
    },
    
    mounted() {
        axios.get(API_AUTH+'profile',{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 this.name = res.data.name;
                 this.login = res.data.login;
                 this.phone = res.data.phone;
             });
    }
}
</script>

<style scoped>

</style>