<template>
  <div class="pa-6">
    <v-card
    variant="elevated"
    class="pa-3"
    color="secondary"
    max-width="344"
    :subtitle="`ID: ${id}`"
    :title="name"
    prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
  >
    <v-card-text>
      <div class="d-flex flex-column align-content-start flex-wrap text-wrap">
        <div>BC: {{heartRate}} bpm</div>
        <div>NG: {{glycemicLevels}} mg/dL</div>
        <div>PA: {{arterialPressure}} mmHg</div>
        <div>TC: {{bodyTemperature}}ºC</div>
        <div>FR: {{respiratoryRate}} ipm</div>
        <div>SO: {{oxygenSaturation}}%</div>
      </div>
      <router-link :to="{name: 'patientPage', params:{id: this.id}}">
        <v-btn>More details</v-btn>
      </router-link>
      
    </v-card-text>
    
  </v-card>
  </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: "John Doe",
            required: true,
        },
        id: {
            type: Number,
            default: 0,
            required: true
        },
        heartRate: {
            type: Number,
            default: 75,
            required: true
        },
        glycemicLevels: {
            type: Number,
            default: 60,
            required: true
        },
        arterialPressure: {
            type: Number,
            default: 106,
            required: true
        },
        bodyTemperature: {
            type: Number,
            default: 35,
            required: true
        },
        respiratoryRate: {
            type: Number,
            default: 14,
            required: true
        },
        oxygenSaturation: {
            type: Number,
            default: 95,
            required: true
        },
    }
};
</script>

<style></style>
