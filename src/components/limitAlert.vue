<template>
    <v-form>
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
</template>

<script>
import axios from "axios";

const API_ALERT = 'http://127.0.0.1:8000/api/alerts/';

export default {
    name: "limitAlert",
    props: ['products'],
    
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
                        this.alert.name = product.name
                        this.alert.product_id = product.id
                        
                        axios.post(API_ALERT + 'store', this.alert, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                             .then(res => {
                                 console.log(res)
                                 this.$emit('submit')
                             }).catch(error => {
                                 console.log(error)
                        })
                    }
                })
            }
        }
    
    },
    
    mounted() {
        this.limit = this.$store.state.limit
    },
    
    methods: {
        setLimit() {
            this.$store.commit('setLimit', this.limit)
        },
    }
}
</script>

<style scoped>

</style>