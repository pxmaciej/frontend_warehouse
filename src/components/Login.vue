<template>
 <v-card
  elevation="7"
  class="mx-auto mt-4"
  dark
  max-width="800px"
>
<v-row>
    <v-col style="padding:0px;">
          <v-img
      height="250"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>
    </v-col>
    <v-col style="padding: 15px;">
        <form @submit.prevent="submit">
        <v-text-field
          v-model="login"
          :counter="10"
          label="Login"
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          :error-messages="errors"
          label="E-mail"
          required
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
      ValidationProvider,

    },
    data: () => ({
      Login: '',
      phoneNumber: '',
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: null,
    }),

    methods: {
      submit () {
        this.$refs.observer.validate()
      },
      clear () {
        this.Login = ''
        this.phoneNumber = ''
        this.email = ''
        this.select = null
        this.checkbox = null
        this.$refs.observer.reset()
      },
    },
}
  
</script>
<style>

</style>

