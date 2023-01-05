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
                            label="User Name"
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
import axios from 'axios';

const API_AUTH = 'http://127.0.0.1:8000/api/auth/';

export default
{
    data: () => ({
        user:{
            login: '',
            password:'',
        },
        show: false,
    }),

    mounted()
    {
        if(this.$store.state.token !== '')
        {
            axios.post(API_AUTH + 'checkToken', { token : this.$store.state.token} )
                 .then( res => {
                     if(res.data.success){
                         this.$router.push('/dashboard');
                     }
                 }).catch(err => {
                this.$store.commit('clearToken');
                this.$router.push('/login');
                console.log(err.data);
            })
        }
    },
    methods: {
        submit () {
            axios.post(API_AUTH + 'login', this.user)
                 .then(res => {
                     this.$store.commit('setToken', res.data.access_token);
                     this.$store.commit('setUserRole', res.data.user.role);
                     this.$store.commit('setUserId', res.data.user.id);
                     console.log(res.data);
                     this.$router.push('/dashboard');
                 })
                 .catch(err => {
                     console.log(err.data);
                 });
        },
        clear () {
            this.login = '';
            this.password = '';
        }
    }
}
</script>
<style>
</style>

