<template>
  <v-container>
    <notifications position="bottom right" reverse/>
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              label="Data początkowa"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            no-title
            @input="menu1 = false"
            locale="pl"
          ></v-date-picker>
        </v-menu>
        <p><strong>{{ startDate }}</strong></p>
      </v-col>
      
      <v-col
        cols="12"
        lg="6"
      >
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              label="Data końcowa"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            no-title
            @input="menu2 = false"
            locale="pl"
          ></v-date-picker>
        </v-menu>
        <p><strong>{{ endDate }}</strong></p>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <v-select
          v-model="selectedProduct"
          :items="filteredProducts"
          item-text="name"
          item-value="id"
          label="Produkt"
          single-line
        >
          
          <template v-slot:prepend-item>
            <v-list-item>
              <v-list-item-content>
                <v-text-field v-model="search" placeholder="Search" @input="searchProduct"></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
          
        </v-select>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          @click="show"
          v-bind:disabled="!startDate || !endDate || !selectedProduct"
        >Wybierz
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-sparkline
        ref="sparkline"
        :type="type"
        :smooth="3"
        :value="valueSet"
        :labels="valueSet"
        :label-size="4"
        :gradient="['#00c6ff', '#F0F', '#FF0']"
        :auto-line-width="true"
      >
        <template v-slot:label="item">
          {{ item.value }}
        </template>
      </v-sparkline>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Stan magazynowy w czasie</v-card-title>
          <v-card-text>
          <v-timeline>
            <v-timeline-item
              v-for="(item, i) in chartData"
              :key="i"
              small
            >
              <template v-slot:opposite>
        <span>
          {{ formatDate(item.date) }}
        </span>
              </template>
              <div class="py-4">
                <h4>
                  Stan Magazynowy
                </h4>
                <h3>
                  {{ item.amount}}
                </h3>
              </div>
            </v-timeline-item>
          </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import AuthService from "@/services/AuthService";
import moment from "moment";

export default {
  name: 'Statistic',
  
  data() {
    return {
      type:'bar',
      startDate: '',
      endDate: '',
      menu1: false,
      menu2: false,
      selectedProduct: 0,
      products: [],
      logs: [],
      chartData: [],
      search: '',
      filteredLogs: []
    }
  },
  
  computed: {
    valueSet() {
      return this.chartData.map(value => value.amount);
    },
    
    labelSet() {
      return this.chartData.map(value => value.date);
    },
    
    filteredProducts() {
      return this.products.filter((product) => product.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  
  created: async function () {
    if (await AuthService.isAuthenticated(this)) {
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
        this.products = res.data;
      });
    },
  
    getLog() {
      axios.get(
        this.$root.API_LOG,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(res => {
        this.logs = res.data;
      });
    },

    notification() {
      this.$notify({
                       title: 'Błąd',
                       text: 'Data początkowa większa niż data końcowa',
                       type: 'error',
                       duration: 3000,
                       speed: 2000,
                     });
    },

    checkDate() {
      if (this.startDate > this.endDate) {
        return false;
      }else{
        return true;
      }
    },

    filterLogs() {
       this.filteredLogs = this.logs.filter((log) => {
          return (
            log.subject_type === "App\\Models\\Product" &&
            (log.event === "updated" || log.event === "created") &&
            log.properties.attributes.id === this.selectedProduct &&
            log.created_at >= new Date(this.startDate).toISOString().substring(0, 10) + "T00:00:00.000Z" &&
            log.created_at <= new Date(this.endDate).toISOString().substring(0, 10) + "T00:00:00.000Z"
          );
        });
    },

    setChartData() {
      this.filterLogs();
      this.chartData = this.filteredLogs.map((log) => {
          return {
            date: new Date(log.created_at),
            amount: log.properties.attributes.amount,
          };
        });
    },

    show() {
      (this.checkDate()) ? this.setChartData() : this.notification();
    },
    
    formatDate(date) {
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
  
    searchProduct() {
      this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  }
}
</script>

<style>
.v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
.v-timeline-item:nth-child(even):not(.v-timeline-item--after),
.v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse)
.v-timeline-item--before {
  text-align: right;
}
</style>