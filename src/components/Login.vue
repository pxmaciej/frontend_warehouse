<template>
 <v-card
  elevation="7"
  class="mx-auto mt-5"
  dark
  max-width="800px"
>
<v-row>
    <v-col 
    style="padding:0px;"
    cols="6">
          <v-img
      height="250"
      src="../assets/dog.jpg"
    ></v-img>
    </v-col>
    <v-col 
    cols="6"
    >
        <form @submit.prevent="submit">
        <v-text-field
          v-model="login"
          :counter="10"
          label="Login"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
        :type="show ? 'text' : 'password'"
          label="Password"
          hint="At least 8 characters"
          required
          @click:append="show = !show"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        ></v-text-field>


      <v-btn
        class="mr-4"
        type="submit"
        :disabled="invalid"
      >
        submit
      </v-btn>
      <v-btn @click="clear">
        clear
      </v-btn>
    </form>

    </v-col>
</v-row>
</v-card>
</template>

<script>


  export default {
    components: {
   

    },
    data: () => ({
      login: '',
      password:'',
      select: null,
      show: false,
     
    }),

    methods: {
      submit () {

      },
      clear () {
        this.login = ''
        this.password = ''
      },
    },
}
  
</script>
<style>

</style>

