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
                v-model="selected"
                :headers="headers"
                :items="products"
                :search="search"
                class="elevation-1"
                show-select
                :single-select=true
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>List Products:</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                            >New Product</v-btn>
                            <v-btn
                                    color="success"
                                    dark
                                    class="mb-2 mr-2"
                                    @click.stop.prevent="showProduct(selected)"
                            >Show</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
    
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.name" label="Product name"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select
                                                    v-model="editedItem.categories"
                                                    :hint="`${categories.name}`"
                                                    :items="categories"
                                                    item-text="name"
                                                    item-value="id"
                                                    label="Select Category"
                                                    persistent-hint
                                                    single-line
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.company" label="Company"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.amount" type="number" label="Amount"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.price" type="number" label="Price"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
    
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
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

const API_PRODUCT = 'http://127.0.0.1:8000/api/products/';

export default {
    name: 'crudProduct',
    props: ['products', 'categories'],
    data: () => ({
        dialog: false,
        search: '',
        headers: [
            {
                text: 'Name',
                align: 'start',
                value: 'name',
            },
            { text: 'id', value: 'id' },
            { text: 'Company', value: 'company' },
            { text: 'Category', value: 'categories[0].name' },
            { text: 'Amount', value: 'amount' },
            { text: 'Price', value: 'price' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        selected: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            categories: [],
            company: '',
            amount: 0,
            price: 0,
        },
        defaultItem: {
            name: '',
            categories: [],
            company: '',
            amount: 0,
            price: 0,
        },
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Product' : 'Edit Product';
        },
    },

    watch: {
        dialog (val) {
            val || this.close();
        },
    },
    methods: {
        showProduct(selected) {
            if (selected.length !== 0) {
                this.$router.push({name: 'product/show', params: { product: selected }})
            }
        },

        editItem (item) {
            this.editedIndex = this.products.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem (item) {
            const index = this.products.indexOf(item);
            confirm('Are you sure you want to delete this item?') && this.products.splice(index, 1);
            axios.delete(API_PRODUCT+'destroy/'+item.id,{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(res => {
                     console.log(res);
                     this.$emit('submit');
                 });
        },

        close () {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        save () {
            if (this.editedIndex > -1) {
                axios.patch(API_PRODUCT+'update/' + this.editedItem.id, this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(res => {
                         console.log(res);
                         this.$emit('submit');
                     });
            } else {
                axios.post(API_PRODUCT+'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(res => {
                         console.log(res);
                         this.$emit('submit');
                     });
            }
            this.close();
        }
    }
}
</script>

