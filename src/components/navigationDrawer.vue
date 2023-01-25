<template>
    <v-navigation-drawer
            expand-on-hover
            v-if="isLoggedIn"
            app
            clipped>
        <v-list>
            <v-list-item class="px-2">
                <v-list-item-avatar>
                    <v-avatar color="indigo">
                        <v-icon class="mr-2" dark>
                            mdi-account-circle
                        </v-icon>
                    </v-avatar>
                </v-list-item-avatar>
            </v-list-item>

            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        {{user.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{user.phone}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list
                nav
                dense>
            <v-list-item link to="/dashboard">
                <v-list-item-icon>
                    <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item link  to="/profile">
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
                <v-list-item-icon>
                    <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Logg out</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import axios from "axios";

const API_AUTH = 'http://127.0.0.1:8000/api/auth/';

export default {
    name: "navigationDrawer",
    
    props: ['isLoggedIn'],
    
    data: () => ({
        isLoggedIn: false,
        user: {
            name: this.$store.state.userData.name,
            phone: this.$store.state.userData.phone
        }
    }),
    
    
    methods: {
        isLogged() {
            this.isLoggedIn = true;
        },

        isLoggedOut() {
            this.isLoggedIn = false;
        },

        logout() {
            axios.post(API_AUTH+'logout', { token : this.$store.state.token })
                 .then( res => {
                     console.log(res.data);
                     this.$store.commit('clearToken');
                     this.isLoggedOut();
                     this.$router.push('/login');
                     localStorage.clear();
                 })
        }
    }
}
</script>

<style scoped>

</style>