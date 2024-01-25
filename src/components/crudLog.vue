<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Wyszukaj"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="logs"
      :search="search"
      sort-by="created_at"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Logi:</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
        </v-toolbar>
      </template>
      <template
        v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter'))"
        v-slot:[`item.${header.value}`]="{ header, value }">
        {{ header.formatter(value) }}
      </template>
      
      <template v-slot:item.properties="{ item }">
        <p v-for="(properties, index) in item.properties" :key="index" style="word-break: break-all">
          {{ properties }}
        </p>
      </template>
    
    </v-data-table>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  name: "crudLog",
  props: ['logs'],
  
  data: () => ({
    search: '',
    headers: [
      {
        text: 'Model danych',
        align: 'start',
        value: 'subject_type',
      },
      {text: 'Id', value: 'id'},
      {text: 'Zdarzenie', value: 'event'},
      {text: 'Id użytkownika', value: 'causer_id'},
      {
        text: 'Właściwości',
        value: 'properties',
        width: '40%'
      },
      {
        text: 'Data utworzenia',
        value: 'created_at',
        formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)
      },
      {
        text: 'Data edytowania',
        value: 'updated_at',
        formatter: (x) => (x ? moment(x).format("DD-MM-YYYY HH:MM") : null)
      },
    ]
  }),
  
  methods: {
    formatDate(value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    }
  }
}
</script>