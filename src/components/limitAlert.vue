<template>
    <div>
        <h4>Limit amount product for new alert: {{limit}}</h4>
        <v-form v-if="role === 'admin'">
            <v-text-field
                    v-model="limit"
                    :counter="10"
                    label="limit"
                    required
            ></v-text-field>
            <v-btn
                    color="success"
                    class="mr-4"
                    @click="setLimit"
            >
                Set Limit
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import axios from "axios";

const API_ALERT = 'http://127.0.0.1:8000/api/alerts/';

export default {
    name: "limitAlert",
    props: ['products', 'role'],

    data: () => ({
        limit: 0,
        alert: {
            product_id: 0,
            name: '',
        },
    }),

    watch: {
        products: function() {
            if (this.limit) {
                this.products.forEach((product) => {
                    if (product.amount <= this.limit) {
                        this.alert.name = product.name;
                        this.alert.product_id = product.id;

                        axios.post(API_ALERT + 'store', this.alert, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                             .then(res => {
                                 console.log(res);
                                 this.$emit('submit');
                             }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        }

    },

    mounted() {
        axios.get(API_ALERT + 'limit', {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 console.log(res);
                 this.limit = res.data;
             }).catch(error => {
            console.log(error);
        });
    },

    methods: {
        setLimit() {
            axios.get(API_ALERT + 'limit/' + this.limit, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     console.log(res);
                 }).catch(error => {
                console.log(error);
            });
        },
    }
}
</script>

<style scoped>

</style>