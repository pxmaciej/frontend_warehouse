<template>
    <v-card>
        <v-card-title>
            <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="orderList"
                :search="search"
                sort-by="dateDeliver"
                class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>List Products in order:</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        small
                        @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>

import axios from "axios";

const API_ORDER_LIST = 'http://127.0.0.1:8000/api/orderlists/';
const API_PRODUCT = 'http://127.0.0.1:8000/api/products/';
const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/';

export default {
    name: 'crudOrderList',
    props: ['orderList', 'products'],
    data: () => ({
        dialog: false,
        search: '',
        headers: [
            {
                text: 'Nazwa',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Ilość', value: 'amount'},
            { text: 'Netto', value: 'netto' },
            { text: 'Vat', value: 'vat' },
            { text: 'brutto', value: 'brutto' },
            { text: 'Name Buyer', value: 'nameBuyer' },
            { text: 'Opcje', value: 'actions', sortable: false },
        ],
        product: {
            id: 0,
            amount: 0,
        },
        statisticItem: {
            name: '',
            product_id: 0,
            amount: 0,
            netto: 0,
            vat: 0,
            brutto: 0
        },
    }),

    methods: {
        deleteItem(item) {
            axios.delete(API_ORDER_LIST+'destroy/'+item.id,{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(() => {
                     this.$emit('submit');
                     
                     this.$notify({
                                      title: 'Sukces',
                                      text: 'Udało się usunąć produkt z zamówienia',
                                      type: 'success',
                                      duration: 3000,
                                      speed: 2000,
                                  });
                 });
            
            this.product.id = item.product_id;
            this.product.amount = item.amount + this.products.find(product => product.id === this.product.id).amount;
            
            axios.patch(API_PRODUCT + 'update/'+this.product.id, this.product, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})

            this.statisticItem.name = 'Order delete product';
            this.statisticItem.product_id = this.product.id;
            this.statisticItem.amount = item.amount;
            this.statisticItem.netto = item.netto;
            this.statisticItem.vat = item.vat;
            this.statisticItem.brutto = item.brutto;
            
            axios.post(API_STATISTICS+'store', this.statisticItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}});
         
        },
    }
}
</script>

