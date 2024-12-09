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
        <q-btn v-if="actionIcons.view" icon="visibility" @click="actionIcons.view(props.row)" flat class="action" />
        <q-btn v-if="actionIcons.edit && !isVisitor" icon="edit" @click="actionIcons.edit(props.row)" flat class="action" />
        <q-btn v-if="actionIcons.delete && !isVisitor" icon="delete" @click="actionIcons.delete(props.row)" flat class="action" />
        <q-btn v-if="actionIcons.return && !isVisitor" icon="beenhere" @click="actionIcons.return(props.row)" flat class="action" />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  actionIcons: {
    type: Object,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    default: 7, // Valor padrão de 7 linhas, mas pode ser modificado dinamicamente
  },
  userType: {
    type: String,
    required: true,
  },
});

const isVisitor = computed(() => props.userType === 'VISITOR');
</script>

<style>
.table {
  width: 100%;
}
.q-table thead:nth-child(1) {
  background-color: #b3eef1;
  color: rgba(56, 56, 56, 0.849);
  font-weight: bold;
}
.action-icons {
  display: flex;
  gap: 2px; /* Ajuste o valor conforme necessário */
  justify-content: center; /* Centraliza os ícones */
  border-bottom: 1px solid rgba(0, 0, 0, 0.148);
  margin-top: 11px;
}
.action {
  margin: 0;
  width: 10px;
  position: relative;
  bottom: 5px;
}
</style>
