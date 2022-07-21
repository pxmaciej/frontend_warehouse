<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Category</th>
                    <th class="text-left">Company</th>
                    <th class="text-left">Amount</th>
                    <th class="text-left">Price</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.company }}</td>
                    <td>{{ product.amount }}</td>
                    <td>{{ product.price }}</td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>

export default {
  name: 'ListProduct',
  props: ['products'],

}
</script>

<style>

</style>
