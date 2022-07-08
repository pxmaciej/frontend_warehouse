<template>
  <v-app>
    <navbar></navbar>
    <v-main>
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import navbar from "./components/Navbar"

export default {
  name: 'App',

  components: {
   navbar
  },

  data: () => ({
    
  }),
};
</script>
