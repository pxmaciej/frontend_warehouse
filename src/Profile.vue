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
import AuthService from '@/services/AuthService'

export default {
  name: "Profile",
  
  components: {
    formProfile,
    profileData
  },
  
  mounted: async function () {
    await AuthService.isAuthenticated(this)
  }
}
</script>

<style scoped>

</style>