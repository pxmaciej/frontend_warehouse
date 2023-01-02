<template>
    <v-container>
        <div class="col-6">
            <profile></profile>
        </div>
        <div class="col-6">
        
        </div>
        
    </v-container>
</template>

<script>
import profile from "./components/formProfile";

export default {
    name: "Profile",
    
    components:{
        profile,
    }
}
</script>

<style scoped>

</style>