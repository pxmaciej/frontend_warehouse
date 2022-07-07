<template>
      <v-app-bar
      dark
      app>
      <div class="d-flex align-center">
        <v-avatar class="d-block text-center mx-auto mt-3" size="50">
            <i class="fa fa-industry navavatar" aria-hidden="true"></i>
        </v-avatar>
   
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Login</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
</template>

<script>


export default {
  name: 'navbar',

  data: () => ({
  
  }),

}
</script>

<style>
.navavatar {
    font-size: 2em;
}
</style>
