<template>
  <v-card>
      <v-card-title>Wykres Produktów</v-card-title>
          <v-sparkline
                  :type="type"
                  :value="valueSet"
                  :labels="labelSet"
                  :auto-line-width="true"
                  :padding="1"
                  :smooth="2"
                  :gradient="['red', 'orange', 'yellow']"
                  :show-labels="true"
          ></v-sparkline>
  </v-card>
</template>

<script>
export default {
    name: 'sparkleProduct',
    props: ['products'],

    data: () => ({
        type: 'bar',
        data: [],
    }),
    computed: {
        valueSet() {
            return this.products.map(product => product.amount);
        },
        labelSet() {
            return this.products.map(product => product.name + ' ' + product.amount);
        }
        
    },
    methods: {
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
    },
}
</script>