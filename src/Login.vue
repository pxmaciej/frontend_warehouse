<template>
  <v-card
    elevation="7"
    class="mx-auto mt-5"
    dark
    max-width="800px"
  >
    <v-row>
      <v-col
        cols="6">
        <v-img
          height="250"
          src="./assets/dog.jpg"
        ></v-img>
      </v-col>
      <v-col
        cols="6">
        <form>
          <v-text-field
            v-model="user.login"
            :counter="10"
            label="Login"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="user.password"
            :type="show ? 'text' : 'password'"
            label="Hasło"
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
            Zaloguj
          </v-btn>
        </form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    user: {
      login: '',
      password: '',
    },
    show: false
  }),
  
  created() {
    if (this.$store.state.token !== '') {
      axios.post(this.$root.API_AUTH + 'checkToken', {token: this.$store.state.token}).then(res => {
        if (res.data.success) {
          this.$router.push('/dashboard');
        }
      }).catch(err => {
        console.log(err.data);
        this.$store.commit('clearToken');
        this.$router.push('/login');
      })
    }
  },
  methods: {
    submit() {
      axios.post(this.$root.API_AUTH + 'login', this.user).then(res => {
        this.$store.commit('setToken', res.data.access_token);
        this.$store.commit('setUserRole', res.data.user.role);
        this.$store.commit('setUserId', res.data.user.id);
        this.$store.commit('setUserData', res.data.user);
        this.$router.push('/dashboard');
      })
           .catch(err => {
             console.log(err.data);
           });
    }
  }
}
</script>
<style>
</style>

