<template>
  <q-input v-model="PesquisaTermo" debounce="300" placeholder="Pesquisar..." @input="onPesquisar" borderless class="BPesquisa">
    <template v-slot:prepend>
      <q-icon name="search" class="IconPesquisa"/>
    </template>
  </q-input>

</template>

<script>
import { ref } from 'vue';

export default {
  // name: 'ComponentName',
  setup () {
    const PesquisaTermo = ref('')


    const onPesquisar = ( ) => {

    }
    return {
      PesquisaTermo,
      onPesquisar
    }
  }
}
</script>

<style>
.BPesquisa{
  border:1.5px solid black;
  border-radius: 15px;
  width: 150px;
  height: 40px;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.479);
  display: flex;
  align-items: center;

}
.BPesquisa .q-field__native {
  position: relative;
  bottom: 8px;
}

.IconPesquisa{
  position: relative;
  bottom: 8px;
  left: 5px;
}
</style>
