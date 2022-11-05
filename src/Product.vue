<template>
    <v-container>
        <v-row
        align="center"
        justify="center">
            <v-card
            elevation="4"
            outlined
            shaped>
                <v-card-title>{{showProduct.name}} Data:</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <p class="text--primary">Name: {{showProduct.name}}</p>
                        </v-col>
                        <v-col>
                            <p class="text--primary">Company: {{showProduct.company}}</p>
                        </v-col>
                        <v-col>
                            <p class="text--primary">Amount: <b>{{showProduct.amount}}</b></p>
                        </v-col>
                        <v-col>
                            <p class="text--primary">Price: {{showProduct.price}}</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-list>
                            <v-card-title>Categories:</v-card-title>
                            <v-list-item
                                    v-for="(category, i) in showProduct.categories"
                                    :key="i"
                            >
                            <v-list-item-content>
                                <v-list-item-title v-text="'Name: ' + category.name"></v-list-item-title>
                                <v-list-item-subtitle v-text="'Description: ' + category.description"></v-list-item-subtitle>
                            </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-row>
                    <v-row align="center"
                           justify="center">
                        <v-card-title>In Orders:</v-card-title>
                        <v-timeline dense>
                            <v-timeline-item
                            v-for="(order, i) in showProductOrder"
                            :key="i"
                            color="teal lighten-3">
                                <h3 v-text="order.nameBuyer"></h3>
                                <h3 v-text="order.dateOrder"></h3>
                                <p v-text="order.address"></p>
                            </v-timeline-item>
                            
                        </v-timeline>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

const API_PRODUCTS_SHOW = 'http://127.0.0.1:8000/api/products/show/'
const API_PRODUCTS_ORDER = 'http://127.0.0.1:8000/api/products/order/'

export default {
    name: "Product",

    props: ['product'],

    data () {
        return {
            showProduct: [],
            showProductOrder: [],
            
        }
    },
    
    mounted: async function () {
        axios.get(API_PRODUCTS_SHOW+this.product['0'].id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 this.showProduct = res.data
             })

        axios.get(API_PRODUCTS_ORDER+this.product['0'].id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
             .then(res => {
                 this.showProductOrder = res.data
             })
    },
}
</script>