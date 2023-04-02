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
                show-select
                :single-select=true
        >
            <template v-slot:item.categories="{ item }">
                <v-chip v-for="(category, index) in item.categories" :key="index" color="primary">{{ category.name }}</v-chip>
            </template>
            
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Lista Produktów:</v-toolbar-title>
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
                                            <v-text-field v-model="editedItem.name" label="Nazwa"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select
                                                    v-model="editedItem.categories"
                                                    :items="categories"
                                                    item-text="name"
                                                    item-value="id"
                                                    label="Kategorie"
                                                    multiple
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.company" label="Firma"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.amount" type="number" label="Ilość"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.netto" @input="calculateBrutto" type="number" label="Netto"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select
                                                    v-model="editedItem.vat"
                                                    @change="calculateBrutto"
                                                    :items="['23', '8', '5', '0', 'zw']"
                                                    item-value="VAT"
                                                    label="VAT"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.brutto" type="number" label="Brutto"></v-text-field>
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
const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/';

export default {
    name: 'crudProduct',
    props: ['products', 'categories'],
    data: () => ({
        dialog: false,
        search: '',
        headers: [
            {
                text: 'Nazwa',
                align: 'start',
                value: 'name',
            },
            { text: 'id', value: 'id' },
            { text: 'Firma', value: 'company' },
            { text: 'Kategorie', value: 'categories' },
            { text: 'Ilość', value: 'amount' },
            { text: 'Netto', value: 'netto' },
            { text: 'VAT', value: 'vat' },
            { text: 'Brutto', value: 'brutto' },
            { text: 'Opcje', value: 'actions', sortable: false },
        ],
        selected: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            categories: [],
            company: '',
            amount: 0,
            netto: 0,
            vat: 0,
            brutto: 0,
        },
        defaultItem: {
            name: '',
            categories: [],
            company: '',
            amount: 0,
            netto: 0,
            vat: 0,
            brutto: 0,
        },
        statisticItem: {
            name: '',
            product_id: 0,
            amount: 0,
            netto: 0,
            vat: 0,
            brutto: 0,
        },
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nowy Produkt' : 'Edytuj Produkt';
        },
    },

    watch: {
        dialog (val) {
            val || this.close();
        },
    },
    methods: {
        calculateBrutto() {
            if (this.editedItem.vat === 'zw') {
                this.editedItem.brutto = this.editedItem.netto;
            } else {
                const netto = parseFloat(this.editedItem.netto);
                const vat = parseFloat(this.editedItem.vat);
                const brutto = netto * (1 + vat / 100);
                this.editedItem.brutto = brutto.toFixed(2);
            }
        },
        
        showProduct(selected) {
            if (selected.length !== 0) {
                this.$router.push({name: 'product/show', params: { product: selected }})
            }
        },

        editItem (item) {
            this.editedIndex = this.products.indexOf(item);
            this.editedItem = Object.assign({}, item);
            
            this.statisticItem.name = 'Edited product';
            this.statisticItem.product_id = this.editedItem.id;
            this.statisticItem.amount = this.editedItem.amount;
            this.statisticItem.netto = this.editedItem.netto;
            this.statisticItem.vat = this.editedItem.vat;
            this.statisticItem.brutto = this.editedItem.brutto;
            
            this.dialog = true;
        },

        deleteItem (item) {
            const index = this.products.indexOf(item);
            confirm('Jesteś pewny, że chcesz usunąć wybrany produkt?') && this.products.splice(index, 1);
            axios.delete(API_PRODUCT+'destroy/'+item.id,{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(() => {
                     this.$emit('submit');

                     this.$notify({
                                      title: 'Sukces',
                                      text: 'Udało się usunąć Produkt',
                                      type: 'success',
                                      duration: 3000,
                                      speed: 2000,
                                  });
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
                     .then(() => {
                         this.$emit('submit');

                         this.$notify({
                                          title: 'Sukces',
                                          text: 'Udało się edytować Produkt',
                                          type: 'success',
                                          duration: 3000,
                                          speed: 2000,
                                      });
                     });
                
                axios.post(API_STATISTICS+'store', this.statisticItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(() => {
                         this.$emit('submit');
                     });
            } else {
                axios.post(API_PRODUCT+'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(() => {
                         this.$emit('submit');
                         
                         this.$notify({
                                          title: 'Sukces',
                                          text: 'Udało się dodać Produkt',
                                          type: 'success',
                                          duration: 3000,
                                          speed: 2000,
                                      });
                     });
            }
            this.close();
        }
    }
}
</script>

