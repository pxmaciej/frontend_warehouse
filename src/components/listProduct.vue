<template>
  <!--
  <div class="table-responsive" id="dataTable" role="grid" aria-describedby="dataTable_info">
    <v-table :data="products"
             :currentPage.sync="currentPage"
             :pageSize="20"
             @totalPagesChanged="totalPages = $event"
             class="table table-striped" id="dataTable">
      <thead slot="head">
        <tr>
          <th scope="col">Nazwa</th>
          <th scope="col">Company</th>
          <th scope="col">Amount</th>
          <th scope="col">Price</th>

        </tr>
      </thead>
      <tbody slot="body" slot-scope="{displayData}">
        <tr v-for="product in displayData"  :key="product.id">
          <td class="text-uppercase">{{product.name}}</td>
          <td class="text-uppercase">{{product.company}}</td>
          <td class="text-uppercase">{{product.amount}}</td>
          <td class="text-uppercase">{{product.price}}</td>

        </tr>
      </tbody>
    </v-table>
    <smart-pagination
        :currentPage.sync="currentPage"
        :totalPages="totalPages"
    />
  </div>
  -->


  <v-data-table
        :headers="headers"
        :items="products"
        :items-per-page="20"
        class="elevation-1"
  >
  </v-data-table>

</template>

<script>

export default {
  name: 'ListProduct',
  props: ['products'],
  data(){
    return{
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Category', value: 'category' },
        { text: 'Company', value: 'company' },
        { text: 'Amount', value: 'amount' },
        { text: 'Price', value: 'price' },
      ],
    }
  },
}
</script>

