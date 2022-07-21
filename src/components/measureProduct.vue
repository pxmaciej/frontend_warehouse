<template>
<div>
    <div v-for="index in products" :key="index.id">
    <div v-if="index.amount<100">
        <h3 class="text-uppercase">{{ index.name}}</h3>
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
</div>
</template>

<script>

export default {
  name: 'MeasureProduct',
  props: ['products'],

}
</script>

<style>

</style>
