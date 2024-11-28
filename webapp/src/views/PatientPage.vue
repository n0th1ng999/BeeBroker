<script setup lang="ts">
import PatientStatisics from "@/components/PatientStatisics.vue";
import { usePatientStore } from "@/stores/patient";
</script>

<template>
  <h4>ID: {{ $route.params.id }}</h4>
  <h1>John Doe</h1>

  <!--!Ver o que se passa com o flexbox-->
  <div class="d-flex justify-space-evenly flex-wrap">
    <Patient-Statisics 
      category="heartRate" 
      :patientData="heartRateHistory"
      class="ma-3 pa-3"
    />
    <Patient-Statisics
      category="glycemicLevels"
      :patientData="glycemicLevelsHistory"
      class="ma-3 pa-3"
    />
    <Patient-Statisics
      category="arterialPressure"
      :patientData="arterialPressureHistory"
      class="ma-3 pa-3"
    />
    <Patient-Statisics
      category="bodyTemperature"
      :patientData="bodyTemperatureHistory"
      class="ma-3 pa-3"
    />
    <Patient-Statisics
      category="respiratoryRate"
      :patientData="respiratoryRateHistory"
      class="ma-3 pa-3"
    />
    <Patient-Statisics
      category="oxygenSaturation"
      :patientData="oxygenSaturationHistory"
      class="ma-3 pa-3"
    />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      patientsStore: usePatientStore(),
    };
  },
  computed: {
    heartRateHistory() {
      return this.patientsStore.getPatient(+this.$route.params.id).heartRate;
    },
    glycemicLevelsHistory() {
      return this.patientsStore.getPatient(+this.$route.params.id)
        .glycemicLevels;
    },
    arterialPressureHistory() {
      return this.patientsStore.getPatient(+this.$route.params.id)
        .arterialPressure;
    },
    bodyTemperatureHistory() {
      return this.patientsStore.getPatient(+this.$route.params.id)
        .bodyTemperature;
    },
    respiratoryRateHistory() {
      return this.patientsStore.getPatient(+this.$route.params.id)
        .respiratoryRate;
    },
    oxygenSaturationHistory() {
      return this.patientsStore.getPatient(+this.$route.params.id)
        .oxygenSaturation;
    },
  },
};
</script>

<style></style>
