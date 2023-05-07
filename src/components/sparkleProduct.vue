<template>
  <v-card>
    <v-card-title>Wykres Produktów</v-card-title>
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :type="type"
          :smooth="3"
          :height="50"
          :value="valueSet"
          :labels="labelSet"
          :label-size="5"
          :gradient="['#00c6ff', '#F0F', '#FF0']"
          :auto-line-width="true"
          auto-draw
        ></v-sparkline>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'sparkleProduct',
  props: ['products'],
  
  data: () => ({
    data: [],
    type: "bar"
  }),
  computed: {
    valueSet() {
      return this.products.map(product => product.amount);
    },
    labelSet() {
      return this.products.map(product => product.name + ': ' + product.amount);
    }
    
  }
}
</script>