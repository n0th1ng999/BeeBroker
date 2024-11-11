<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-card-item>
      <v-card-title>
        Welcome!
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="">
      <v-text-field
        v-model="username"
        label="Username"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        type="password"
      ></v-text-field>

      <v-btn
        :loading="loading"
        class="mt-2"
        text="Submit"
        type="submit"
        block
      ></v-btn>
    </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
data() {
  return {
    username: "",
    password: ""
  }
},
}
</script>

<style>

</style>