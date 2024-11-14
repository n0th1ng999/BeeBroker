<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useWebSocket } from '@vueuse/core'
import { usePatientStore } from "./stores/patient";
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
    {{webSocket.data}}
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      ws: useWebSocket('ws://localhost:8080', {autoReconnect: true}),
      patientStore: usePatientStore()
    }
  },
  computed: {
    webSocket() {
      //this.addData(this.ws.data)
      this.patientStore.checkNewPatients(this.ws.data)
      return {
        status: this.ws.status,
        data: this.ws.data,
        send: this.ws.send,
        open: this.ws.open,
        close: this.ws.close
      }
    }
  },
  methods: {
    addData: (data) => {
     console.log(data);
    }
  },
};
</script>

<style scoped></style>
