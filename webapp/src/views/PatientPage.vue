<template>
  <h4>ID: {{$route.params.id}}</h4>
  <h1>John Doe</h1>

  <!--Nota: Transformar este v-card em um componente separado!!!-->
  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="344"
  >
    <v-card-item>
      <v-card-title>
        75 BPM
      </v-card-title>

      <v-card-subtitle>
        Frequência Cardíaca
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
    :model-value="heartRateHistory">

    </v-sparkline>
  </v-container>
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  data() {
    return {
      //Nota: Temporário. Estes valores estarão dentro de uma store
      heartRateHistory: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0,]
    }
  },
}
</script>

<style>

</style>