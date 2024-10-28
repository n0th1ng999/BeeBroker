<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <v-container>
      <v-app-bar color="primary">
        <template v-slot:prepend>
          <router-link :to="{ name: 'main' }">
            <v-btn icon="$mdiHome"> Home </v-btn></router-link
          >
        </template>
        <v-app-bar-title>BeeBroker Web Client</v-app-bar-title>
      </v-app-bar>
    </v-container>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped></style>
