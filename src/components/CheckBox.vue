<template>
  <q-page class="q-pa-md">
    <q-checkbox v-model="lembrarMe" label="Lembrar-me" color="$primary" keep-color />
    <div>
      <p>Checkbox está {{ lembrarMe ? 'marcado' : 'desmarcado' }}.</p>
    </div>
  </q-page>
</template>

<script>
export default {
  setup () {
    return {
      lembrarMe: false
    }
  }
}
</script>

<style>
.q-pa-md {
  color: black;
}
</style>
