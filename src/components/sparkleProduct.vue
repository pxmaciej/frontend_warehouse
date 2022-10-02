<template>
  <div>
    <v-sparkline
        :value="productAmount"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="lineWidth"
        :stroke-linecap="lineCap"
        :gradient-direction="gradientDirection"
        :fill="fill"
        :type="type"
        :auto-line-width="autoLineWidth" auto-draw
        :show-labels="showLabels"
        :label-size="labelSize"
    ></v-sparkline>
  </div>
  
</template>

<script>
export default {
  name: "sparkleProduct",
  props: ['products'],
  
  data: () => ({
    productAmount: [],
    productDate: []
  }),
  
  mounted:  async function () {
    
      this.products.forEach( (product) => {
          this.productAmount.push(product.amount)
          this.productDate.push(product.date)
      })
  }
}
</script>

<style scoped>

</style>