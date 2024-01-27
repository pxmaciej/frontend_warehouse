<template>
  <v-card>
    <v-card-title>Profil Użytkownika</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon v-text="icons.mdiAccount"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>Imie:</v-list-item-title>
            <v-list-item-subtitle>{{ profile.name }}</v-list-item-subtitle>
          
          </v-list-item>
        </v-list-item>
        <v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon v-text="icons.mdiLoginVariant"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login:</v-list-item-title>
            <v-list-item-subtitle>{{ profile.login }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-item>
        <v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon v-text="icons.mdiPhone"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>Telefon:</v-list-item-title>
            <v-list-item-subtitle>{{ profile.phone }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import {mdiAccount, mdiLoginVariant, mdiPhone} from "@mdi/js";

export default {
  name: "profileData",
  props: ['profile'],

  data() {
    return {
      icons: {
        mdiAccount,
        mdiLoginVariant,
        mdiPhone
      }
    }
  }
}
</script>

<style scoped>

</style>