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
    cols="6">
        <form>
        <v-text-field
          v-model="user.email"
          :counter="10"
          label="Email"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          :type="show ? 'text' : 'password'"
          label="Password"
          hint="At least 8 characters"
          required
          @click:append="show = !show"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        ></v-text-field>

  
      <v-btn
        class="mr-4"
        type="submit"
        @click.prevent="submit"
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
import AuthService from "../services/auth.service.js"


  export default {
    components: {
    },
    data: () => ({
      user:{
        email: '',
        password:'',
      },
      show: false,
    }),

    mounted(){
        if(this.$store.state.token != ''){
         if(AuthService.check(this.$store.state.token)){
           this.$router.push('/dashboard')
         }else{
          this.$store.commit('clearToken');
         }
        }
        
    },
    methods: {
      submit () {
        if(this.user.email&&this.user.password){
          if(AuthService.login(this.user))
          this.$router.push('/dashboard')
        }

      },
      clear () {
        this.email = ''
        this.password = ''
      },
    },
}
  
</script>
<style>

</style>

