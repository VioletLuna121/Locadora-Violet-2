<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[rowsPerPage]"
    :rows-per-page="rowsPerPage"
    class="table"

  >

    <template v-slot:body-cell-action="props">
      <div class="action-icons border-left">
        <q-btn v-if="actionIcons.view" icon="visibility" @click="actionIcons.view(props.row)" flat class="action"/>
        <q-btn v-if="actionIcons.edit" icon="edit" @click="actionIcons.edit(props.row)" flat class="action"/>
        <q-btn v-if="actionIcons.delete" icon="delete" @click="actionIcons.delete(props.row)" flat class="action"/>
        <q-btn v-if="actionIcons.return" icon="beenhere" @click="actionIcons.return(props.row)" flat class="action"/>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps,} from 'vue';

const props = defineProps({
  rows: {
    type: Array,
    Required:true,
    default: () => []
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  actionIcons: {
    type: Object,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    default: 8 // Valor padrão de 8 linhas, mas pode ser modificado dinamicamente
  }
});


</script>

<style>

.table {
  width: 100%;

}
.q-table thead:nth-child(1) {
  background-color: #333333;
  color: white;
  font-weight: bold;
}
.action-icons {
  display: flex;
  gap: 2px; /* Ajuste o valor conforme necessário */
  justify-content: center; /* Centraliza os ícones */
  border-bottom: 1px solid rgba(0, 0, 0, 0.148);
  margin-top: 11px;

}
.action{
  margin: 0;
  width: 10px;
  position: relative;
  bottom: 5px;
}

</style>
