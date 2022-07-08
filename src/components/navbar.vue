<template>
      <v-app-bar
      dark
      app>
      <div class="d-flex align-center">
       <v-btn
       href="/"
       text
       >
            <v-avatar class="d-block text-center mx-auto mt-3" size="50">
                <i class="fa fa-industry navavatar" aria-hidden="true"></i>
            </v-avatar>
            <span class="ml-2"><h1>Warehouse</h1></span> 
       </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="/login"
        text
      >
        <span class="mr-2">Login</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
</template>

<script>


export default {
  name: 'Navbar',

  data: () => ({
  
  }),

}
</script>

<style>
.navavatar {
    font-size: 2em;
}
</style>
