<template>
    <v-data-table
            :headers="headers"
            :items="statistics"
            sort-by="category"
            class="elevation-1"
    >
        <template
                v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter'))"
                v-slot:[`item.${header.value}`]="{ header, value }">
            {{ header.formatter(value) }}
        </template>
        
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>List Statistics:</v-toolbar-title>
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
                        >New Statistic</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.name" label="Statistic name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select
                                                v-model="editedItem.product_id"
                                                :hint="`${products.name}`"
                                                :items="products"
                                                item-text="name"
                                                item-value="id"
                                                label="Select Porduct"
                                                persistent-hint
                                                single-line
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.amount" label="Amount"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.price" label="Price"></v-text-field>
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
</template>

<script>

import axios from "axios";
import moment from "moment/moment";

const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/';

export default {
    name: 'crudStatistic',
    props: ['statistics', 'products'],
    data: () => ({
        dialog: false,
        headers: [
            {
                text: 'Name',
                align: 'start',
                value: 'name',
            },
            { text: 'Product', value: 'product_name' },
            { text: 'Amount', value: 'amount' },
            { text: 'Price', value: 'price' },
            { text: 'Created', value: 'created_at', formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)},
            { text: 'Updated', value: 'updated_at', formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)},
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
            name: '',
            product_id: 0,
            amount: 0,
            price: 0,
        },
        defaultItem: {
            name: '',
            product_id: 0,
            amount: 0,
            price: 0,
        },
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Statistic' : 'Edit Statistic';
        },
    },

    watch: {
        dialog (val) {
            val || this.close();
        },
    },
    methods: {
        formatDate(value) {
            return moment(String(value)).format('MM/DD/YYYY hh:mm')
        },
        
        editItem (item) {
            this.editedIndex = this.statistics.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem (item) {
            const index = this.statistics.indexOf(item);
            confirm('Are you sure you want to delete this item?') && this.statistics.splice(index, 1);
            axios.delete(API_STATISTICS+'destroy/'+item.id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(() => {
                     this.$emit('submit');

                     this.$notify({
                                      title: 'Success',
                                      text: 'Success Delete Statistic',
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
                axios.patch(API_STATISTICS+'update/' + this.editedItem.id, this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(() => {
                         this.$emit('submit');

                         this.$notify({
                                          title: 'Success',
                                          text: 'Success Update Statistic',
                                          type: 'success',
                                          duration: 3000,
                                          speed: 2000,
                                      });
                     });
            } else {
                axios.post(API_STATISTICS+'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(() => {
                         this.$emit('submit');

                         this.$notify({
                                          title: 'Success',
                                          text: 'Success Add Statistic',
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

