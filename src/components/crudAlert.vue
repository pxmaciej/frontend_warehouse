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
                :items="alerts"
                :search="search"
                sort-by="name"
                class="elevation-1"
        >
            <template
                    v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter')
              )"
                    v-slot:[`item.${header.value}`]="{ header, value }"
            >
                {{ header.formatter(value) }}
            </template>
            
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>List alerts:</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="800px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                            >New Alert</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="editedItem.name" label="Alert name"></v-text-field>
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

const API_ALERT = 'http://127.0.0.1:8000/api/alerts/';

export default {
    name: 'crudAlert',
    props: ['alerts', 'products'],
    data: () => ({
        dialog: false,
        search: '',
        headers: [
            {
                text: 'Alert name',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Product Name', value: 'product_name' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
            product_id: 0,
            name: '',
        },
        defaultItem: {
            product_id: 0,
            name: '',
        },
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Alert' : 'Edit Alert';
        },
    },

    mounted: async function () {
    },

    watch: {
        dialog (val) {
            val || this.close();
        },
    },
    methods: {
        editItem (item) {
            this.editedIndex = this.alerts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem (item) {
            const index = this.alerts.indexOf(item);
            confirm('Are you sure you want to delete this item?') && this.alerts.splice(index, 1);
            axios.delete(API_ALERT+'destroy/'+item.id,{headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(() => {
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
                axios.patch(API_ALERT+'update/'+ this.editedItem.id, this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                     .then(res => {
                         console.log(res);
                         this.$emit('submit');
                     });
            } else {
                axios.post(API_ALERT+'store', this.editedItem, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
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

