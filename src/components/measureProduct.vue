<template>
<div>
    <div v-for="index in least" :key="index.name">
        <h3 class="text-uppercase">{{ index.name}}</h3>
        <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :value="index.amount"
        color="teal"
        >
        {{ index.amount }}
        </v-progress-circular>
    </div>
</div>
</template>

<script>
import axios from 'axios';



export default {
  name: 'MeasureProduct',
    data () {
      return {
        least: [],
      }
    },
    mounted() {
      axios.get('http://127.0.0.1:8000/api/product/index', { token : this.$store.state.token})
    .then( res=>{
        res.data.forEach(element => {
            if(element.amount <= 200){
                var tmp = 0;
                this.least[tmp] = element
                tmp++
                console.log(this.least)
            }
        });
    })
    }
}
</script>

<style>

</style>
