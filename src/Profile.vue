<template>
  <v-container>
    <v-row>
      <div class="col-6">
        <formProfile @submit="getProfile"></formProfile>
      </div>
      <div class="col-6">
        <profileData :profile="profile"></profileData>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import formProfile from "./components/formProfile";
import profileData from "@/components/profileData";
import AuthService from '@/services/AuthService'

export default {
  name: "Profile",
  
  components: {
    formProfile,
    profileData
  },

  data() {
    return {
      profile: [],
    }
  },
  
  mounted: async function () {
    if (await AuthService.isAuthenticated(this)) {
      this.getProfile();
    }
  },

  methods: {
    getProfile() {
      axios.get(
      this.$root.API_AUTH + 'profile',
      {headers: {"Authorization": 'Bearer ' + this.$store.state.token}}
    ).then(res => {
      this.profile = res.data;
    });
    }
  }
}
</script>