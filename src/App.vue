<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar"

export default {
  name: 'App',

  components: {
   Navbar
  },

  data: () => ({
    
  }),
};
</script>
