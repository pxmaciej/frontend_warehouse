<template>
    <v-container>
        <v-row>
            <div class="col-6">
                <formProfile></formProfile>
            </div>
            <div class="col-6">
                <profileData></profileData>
            </div>
        </v-row>
    </v-container>
</template>

<script>
import formProfile from "./components/formProfile";
import profileData from "@/components/profileData";

export default {
    name: "Profile",
    
    components:{
        formProfile,
        profileData
    }
}
</script>

<style scoped>

</style>