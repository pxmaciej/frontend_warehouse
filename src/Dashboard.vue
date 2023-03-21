<template>
    <div class="container">
        <notifications position="bottom right" reverse/>
        <div class="row">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="warning" v-bind="attrs" v-on="on" fab dark>
                        Alerts
                        <v-badge color="red" :content="alerts.length"></v-badge>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(alert, index) in alerts" :key="index">
                        <v-list-item-title>{{ alert.name }} </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="row">
            <div class="col-12">
                <sparkleProduct :products="products"></sparkleProduct>
            </div>
        </div>
        <div class="row">
            <div class="col-8">
                <crudProduct :products="products" :categories="categories" @submit="getData"></crudProduct>
            </div>
            <div class="col-4">
                <measureProduct :products="products"></measureProduct>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <crudCategory :categories="categories" @submit="getData"></crudCategory>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <crudOrder :orders="orders" @submit="getData"></crudOrder>
            </div>
        </div>
        <div class="row" v-if="role === 'admin'">
            <div class="col-6">
                <crudAlert :alerts="alerts" :products="products" @submit="getAlerts"></crudAlert>
            </div>
            <div class="col-6">
                <limitAlert :products="products" :alerts="alerts" @submit="getAlerts"></limitAlert>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <crudUser  v-if="role === 'admin'"></crudUser>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <crudStatistic v-if="role === 'admin'" :statistics="statistics" :products="products" @submit="getData"></crudStatistic>
            </div>
        </div>
    </div>
</template>

<script>
import crudProduct from './components/crudProduct.vue'
import crudOrder from "./components/crudOrder"
import crudAlert from "./components/crudAlert";
import measureProduct from './components/measureProduct.vue'
import crudCategory from "./components/crudCategory";
import crudStatistic from "./components/crudStatistic";
import sparkleProduct from "./components/sparkleProduct";
import limitAlert from "./components/limitAlert";
import crudUser from "@/components/crudUser";
import AuthService from '@/services/AuthService'
import axios from 'axios'

const API_PRODUCT = 'http://127.0.0.1:8000/api/products/index';
const API_ORDER = 'http://127.0.0.1:8000/api/orders/index';
const API_ALERT = 'http://127.0.0.1:8000/api/alerts/index';
const API_CATEGORY = 'http://127.0.0.1:8000/api/categories/index';
const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/index';

export default {
    name: 'Dashboard',
    
    components:{
        sparkleProduct,
        crudProduct,
        measureProduct,
        crudOrder,
        crudAlert,
        crudCategory,
        crudStatistic,
        limitAlert,
        crudUser,
    },
    
    data () {
        return{
            products: [],
            categories: [],
            orders: [],
            alerts: [],
            statistics: [],
            role: ""
        }
    },
    
    computed: {
    },
    
    created: async function() {
        if (await AuthService.isAuthenticated(this)) {
            this.role = this.$store.state.role;
            axios.get(API_PRODUCT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.products = res.data;
                 });

            axios.get(API_CATEGORY, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.categories = res.data;
                 });

            axios.get(API_ORDER, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.orders = res.data;
                 });

            axios.get(API_ALERT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.alerts = res.data;
                 });

            axios.get(API_STATISTICS, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.statistics = res.data;
                 });
        }
    },

    mounted: async function () {
    },
    
    methods: {
        getData() {
            axios.get(API_PRODUCT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.products = res.data;
                 });

            axios.get(API_ORDER, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.orders = res.data;
                 });

            axios.get(API_CATEGORY, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.categories = res.data;
                 });

            axios.get(API_STATISTICS, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.statistics = res.data;
                 });
        },
        
        getAlerts() {
            axios.get(API_ALERT, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     this.alerts = res.data;
                 });
        }
    }
}
</script>

<style>
</style>
