<template>
<div class="row">
    <div v-for="index in tenProducts" :key="index.id" class="col-4">
          <h3 class="text-uppercase">{{ index.name }}</h3>
          <v-progress-circular
          :rotate="360"
          :size="100"
          :width="15"
          :value="index.amount"
          color="red"
          >
          {{ index.amount }}
          </v-progress-circular>
    </div>
    
</div>
</template>

<script>

export default {
  name: 'measureProducts',

  props: ['products'],

  comments:{},

  data () {
    return{
        tenProducts: []
    }
  },

    watch: {
        products: function () {
            this.tenProducts = [];
            this.products.forEach((product) => {
                if (product.amount < 100) {
                    this.tenProducts.push(product);
                }
            });
        }
    },
    mounted() {
        this.products.forEach((product) => {
            if (product.amount < 100) {
                this.tenProducts.push(product);
            }
        });
    },
    
    methods: {
  }
}
</script>
