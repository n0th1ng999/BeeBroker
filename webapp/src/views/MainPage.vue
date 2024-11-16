<script setup lang="ts">
import PatientCard from "../components/PatientCard.vue";
import { usePatientStore } from "../stores/patient";
</script>

<template>
  <h1>Hello, JOHN DOE!!!</h1>
  <h2>Patients</h2>
  <div class="d-flex flex-wrap">
    <PatientCard v-for="patient in patients" v-bind:key="patient.id" :name="'John Doe'" :id="patient.id" :heartRate="patient.heartRate[patient.heartRate.length -1]" :glycemicLevels="patient.glycemicLevels[patient.glycemicLevels.length -1]" :arterialPressure="patient.arterialPressure[patient.arterialPressure.length -1]" :bodyTemperature="patient.bodyTemperature[patient.bodyTemperature.length -1]" :respiratoryRate="patient.respiratoryRate[patient.respiratoryRate.length -1]" :oxygenSaturation="patient.oxygenSaturation[patient.oxygenSaturation.length -1]"/>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      patientStore: usePatientStore()
    }
  },
  computed: {
    patients() {
      return this.patientStore.getEvery 
    }
  },
};
</script>

<style></style>
