<template>
  <v-app>
    <navbar></navbar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import navbar from "./components/navbar"

export default {
  name: 'App',

  components: {
   navbar
  },
  
  data: () => ({
  }),
	
};
</script>
