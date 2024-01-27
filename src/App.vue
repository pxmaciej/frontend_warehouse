<template>
  <v-app>
    
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = true"> </v-app-bar-nav-icon>
        <v-toolbar-title>Magazyn</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn href="/contact" text>
        <span class="mr-2">Kontakt</span>
        <v-icon>mdi-email-alert-outline</v-icon>
      </v-btn>
      <v-btn href="/login" text>
        <span class="mr-2">Logowanie</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-navigation-drawer
      v-if="isLoggedIn"
      app
      clipped
      v-model="drawer"
      expand-on-hover>
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
              {{ user['name'] }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ user['phone'] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <v-divider></v-divider>
      
      <v-list
        dense
        nav>
        <v-list-item link to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Magazyn</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/profile">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Profil</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="user.role === 'admin'"  link to="/statistic">
          <v-list-item-icon>
            <v-icon>mdi-poll</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Statystyki</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Wylogowanie</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <v-container fluid>
        <router-view @isLogged="isLogged" @isLoggedOut="isLoggedOut"></router-view>
      </v-container>
    
    </v-main>
    
    <v-footer app>
    
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  
  components: {},
  
  data: function () {
    return {
      isLoggedIn: false,
      user: [],
      drawer: false
    }
  },
  
  methods: {
    isLogged() {
      this.isLoggedIn = true;
      this.user = this.$store.state.userData;
    },
    
    isLoggedOut() {
      this.isLoggedIn = false;
    },
    
    logout() {
      axios.get(
        this.$root.API_AUTH + 'logout',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$store.commit('clearToken');
        this.isLoggedOut();
        this.$router.push('/login');
        localStorage.clear();
      });
    }
  }
}
</script>