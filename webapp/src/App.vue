<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { usePatientStore } from "./stores/patient";
import { getCurrentInstance } from 'vue'
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
      <hr>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      // ws: useWebSocket('ws://localhost:8080', {autoReconnect: true}),
      patientStore: usePatientStore(),
      wsConnection: null,
      message: null,
    }
  },
  mounted() {
    this.wsConnection = new WebSocket("ws://localhost:8080")
    this.wsConnection.onmessage = function(event) {
      console.log(event);
      const patStore = usePatientStore()
      patStore.checkNewPatients(event.data)
    }
    this.wsConnection.onopen = function(event) {
      console.log(event)
      console.log("Successfully connected to the echo websocket server...")
    }
  }
};
</script>

<style scoped></style>
