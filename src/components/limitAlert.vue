<template>
  <v-card>
    <v-card-title>Ustaw Alarm: {{ value }}</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="value"
          :counter="10"
          label="Ustaw limit"
          required
        ></v-text-field>
        <v-btn
          color="success"
          class="mr-4"
          @click="setLimit"
        >
          Submit
        </v-btn>
      </v-form>
    </v-card-text>
  
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "limitAlert",
  props: ['products', 'alerts', 'limit'],
  
  data: () => ({
    value: 0
  }),

 watch: {
    limit(newLimit) {
      // Reaguj na zmiany w limit i zaktualizuj value
      this.value = newLimit;
    }
  },

  methods: {
    setLimit() {
      axios.get(
        this.$root.API_ALERT + 'limit/' + this.value,
        {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
      ).then(() => {
        this.$notify({
                       title: 'Sukces',
                       text: 'Udało się ustawić limit',
                       type: 'success',
                       duration: 3000,
                       speed: 2000,
                     });
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
</script>