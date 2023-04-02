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
            :items="statistics"
            :search="search"
            sort-by="created_at"
    >
        <template
                v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter'))"
                v-slot:[`item.${header.value}`]="{ header, value }">
            {{ header.formatter(value) }}
        </template>
        
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>Lista Statystyk:</v-toolbar-title>
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
                                                label="Wybierz Produkt"
                                                persistent-hint
                                                single-line
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.amount" label="Ilość"></v-text-field>
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
import moment from "moment/moment";

const API_STATISTICS = 'http://127.0.0.1:8000/api/statistics/';

export default {
    name: 'crudStatistic',
    props: ['statistics', 'products'],
    data: () => ({
        dialog: false,
        search: '',
        headers: [
            {
                text: 'Nazwa',
                align: 'start',
                value: 'name',
            },
            { text: 'Produkt', value: 'product_name' },
            { text: 'Ilość', value: 'amount' },
            { text: 'Netto', value: 'netto' },
            { text: 'VAT', value: 'vat' },
            { text: 'Brutto', value: 'brutto' },
            { text: 'Utworzenie', value: 'created_at', formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)},
            { text: 'Edytowano', value: 'updated_at', formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)},
            { text: 'Opcje', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
            name: '',
            product_id: 0,
            amount: 0,
            netto: 0,
            vat: 0,
            brutto: 0
        },
        defaultItem: {
            name: '',
            product_id: 0,
            amount: 0,
            netto: 0,
            vat: 0,
            brutto: 0
        },
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nowa Statystyka' : 'Edytuj Statystykę';
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
            confirm('Jesteś pewny, że chcesz usunąć wybrany statystykę?') && this.statistics.splice(index, 1);
            axios.delete(API_STATISTICS+'destroy/'+item.id, {headers: {"Authorization": 'Bearer ' + this.$store.state.token}})
                 .then(() => {
                     this.$emit('submit');

                     this.$notify({
                                      title: 'Sukces',
                                      text: 'Udało się usunąć Statystykę',
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
                                          title: 'Sukces',
                                          text: 'Udało się edytować Statystykę',
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
                                          title: 'Sukces',
                                          text: 'Udało się dodać Statystykę',
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

