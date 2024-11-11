<template>
  <v-card class="mx-auto my-8" elevation="16" min-width="344">
    <v-card-item>
      <v-card-title>
        {{ patientData[patientData.length - 1] }} {{ labels.unit }}
      </v-card-title>

      <v-card-subtitle>
        {{ labels.designation }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-container fluid>
        <v-sparkline
          :fill="true"
          :gradient="['#42b3f4']"
          :line-width="4"
          :padding="7"
          :smooth="true"
          auto-draw
          :model-value="patientData"
        >
        </v-sparkline>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
enum Category {
  heartRate = "heartRate",
  glycemicLevels = "glycemicLevels",
  arterialPressure = "arterialPressure",
  bodyTemperature = "bodyTemperature",
  respiratoryRate = "respiratoryRate",
  oxygenSaturation = "oxygenSaturation",
}
export default {
  props: {
    category: {
      type: Category,
      required: true,
    },
    patientData: {
      type: Array,
      required: true,
    },
  },
  computed: {
    labels() {
      if (this.category == Category.heartRate) {
        return {
          designation: "Heart Rate",
          unit: "BPM",
        };
      } else if (this.category == Category.glycemicLevels) {
        return {
          designation: "Glycemic Levels",
          unit: "mg/dL",
        };
      } else if (this.category == Category.arterialPressure) {
        return {
          designation: "Arterial Pressure",
          unit: "mmHg",
        };
      } else if (this.category == Category.bodyTemperature) {
        return {
          designation: "Body Temperature",
          unit: "ºC",
        };
      } else if (this.category == Category.respiratoryRate) {
        return {
          designation: "Respiratory Rate",
          unit: "ipm",
        };
      } else if (this.category == Category.oxygenSaturation) {
        return {
          designation: "Oxygen Saturation",
          unit: "%",
        };
      }
    },
  },
};
</script>

<style></style>
