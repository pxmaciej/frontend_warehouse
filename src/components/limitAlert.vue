<template>
  <v-card>
    <v-card-title>Alarm do stanu magazynowego: {{ limit }}</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="limit"
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
  props: ['products', 'alerts'],
  
  data: () => ({
    limit: 0,
    alert: {
      product_id: 0,
      name: '',
    },
  }),
  
  watch: {
    products: function () {
      this.products.forEach((product) => {
        if (product.amount <= this.limit) {
          this.alert.name = product.name;
          this.alert.product_id = product.id;
          
          axios.post(
            this.$root.API_ALERT + 'store', this.alert,
            {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
          ).then(() => {
            this.$emit('submit');
          }).catch(error => {
            console.log(error);
          });
        }
      });
    }
  },
  
  created() {
    axios.get(
      this.$root.API_ALERT + 'limit',
      {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
    ).then(res => {
      this.limit = res.data;
    }).catch(error => {
      console.log(error);
    });
  },
  
  methods: {
    setLimit() {
      axios.get(
        this.$root.API_ALERT + 'limit/' + this.limit,
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
    },
  }
}
</script>

<style scoped>

</style>