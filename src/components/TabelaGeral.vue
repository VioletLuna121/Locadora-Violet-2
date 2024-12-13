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
        <q-btn v-if="actionIcons.edit && user.role === 'ADMIN'" icon="edit" @click="actionIcons.edit(props.row)" flat class="action" />
        <q-btn v-if="actionIcons.delete && user.role === 'ADMIN'" icon="delete" @click="actionIcons.delete(props.row)" flat class="action" />
        <q-btn v-if="actionIcons.return && user.role === 'ADMIN'" icon="beenhere" @click="actionIcons.return(props.row)" flat class="action" />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

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
});

// Definindo a reatividade para o usuário
const user = ref({ role: '' });

// Função para validar o papel do usuário
const userValid = () => {
  const role = localStorage.getItem('role');
  if (role) {
    user.value.role = role;
  } else {
    console.warn("Função não encontrada em localStorage. Definindo como 'VISITOR' por padrão");
    user.value.role = 'ADMIN'; // Define como 'VISITOR' se não existir
  }
};

// Chama a função ao montar o componente
onMounted(() => {
  userValid();
  console.log('User Role from localStorage:', user.value.role); // Log para verificar o papel
});
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
