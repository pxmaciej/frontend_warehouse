<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Wykres ilości produktu w czasie</v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateRangeText"
                        label="Picker in menu"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateRange"
                      no-title
                      scrollable
                      range
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="filteredLogs"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedProduct"
                    :items="product"
                    item-text="name"
                    item-value="id"
                    label="Produkt"
                    single-line
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-text>
            <canvas ref="chart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import axios from "axios";
import AuthService from "@/services/AuthService";
import Chart from "chart.js";


export default {
  name: 'Statistic',

  data() {
    return {
      dateRange: "",
      selectedDates: null,
      menu: false,
      selectedProduct: 0,
      product: [],
      log: []
    }
  },
  computed: {
    dateRangeText () {
      return this.dateRange.join(' ~ ')
    },
    filteredLogs() {
        const filteredLogs = this.logs.filter((log) => {
          return (
            log.subject_type === "App\\Models\\Product" &&
            (log.event === "updated" || log.event === "created") &&
            new Date(log.created_at) >= this.dateRange[0] &&
            new Date(log.created_at) <= this.dateRange[1]
          );
        });
        const chartData = filteredLogs.map((log) => {
          return {
            date: new Date(log.created_at),
            amount: log.properties.attributes.amount,
          };
        });
        return chartData;
    }
  },
  
  created: async function () {
    if (await AuthService.isAuthenticated(this)) {
      this.role = this.$store.state.role;
      this.getProduct();
      this.getLog();
    }
  },
  
  methods: {
    getProduct() {
      axios.get(
        this.$root.API_PRODUCT + 'index',
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.product = res.data;
      });
    },
  
    getLog() {
      axios.get(
        this.$root.API_LOGS,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.log = res.data;
      });
    },
    
    
  }
}

</script>