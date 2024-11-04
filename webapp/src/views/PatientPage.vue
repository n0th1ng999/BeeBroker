<script setup lang="ts">
import PatientStatisics from "@/components/PatientStatisics.vue";
</script>

<template>
  <h4>ID: {{ $route.params.id }}</h4>
  <h1>John Doe</h1>

  <!--!Ver o que se passa com o flexbox-->
  <div class="d-flex wrap">
    <Patient-Statisics category="heartRate" :patientData="heartRateHistory" />
    <Patient-Statisics
      category="glycemicLevels"
      :patientData="glycemicLevelsHistory"
    />
    <Patient-Statisics
      category="arterialPressure"
      :patientData="arterialPressureHistory"
    />
    <Patient-Statisics
      category="bodyTemperature"
      :patientData="bodyTemperatureHistory"
    />
    <Patient-Statisics
      category="respiratoryRate"
      :patientData="respiratoryRateHistory"
    />
    <Patient-Statisics
      category="oxygenSaturation"
      :patientData="oxygenSaturationHistory"
    />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      //Nota: Temporário. Estes valores estarão dentro de uma store
      heartRateHistory: [
        60, 72, 84, 78, 65, 75, 80, 70, 76, 82, 68, 74, 86, 72,
      ],
      glycemicLevelsHistory: [
        90, 105, 88, 110, 95, 100, 120, 98, 102, 85, 92, 115, 108, 99,
      ],
      arterialPressureHistory: [
        36.5, 36.8, 37.2, 36.9, 36.6, 37.0, 37.4, 36.7, 37.1, 36.3, 36.5, 37.6,
        37.0, 36.8,
      ],
      bodyTemperatureHistory: [
        36.5, 36.8, 37.2, 36.9, 36.6, 37.0, 37.4, 36.7, 37.1, 36.3, 36.5, 37.6,
        37.0, 36.8,
      ],
      respiratoryRateHistory: [
        12, 14, 16, 15, 13, 14.5, 15.5, 13.5, 14, 16.5, 15, 14.2, 13.8, 14.8,
      ],
      oxygenSaturationHistory: [
        98, 96, 94, 97, 99, 95, 96.5, 97.5, 98.5, 93, 95.5, 97, 96, 98,
      ],
    };
  },
};
</script>

<style></style>
