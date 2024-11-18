<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{ edit: editItem, return:returnItem}"/>

        <!-- Modal para Nova Aluguel -->
        <q-dialog v-model="JModalNew" class="JmodalRent Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Aluguel</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <q-input v-model="newUser.name" label="Nome do Usuário" required borderless  class="InP"/>
                <q-input v-model="newUser.book" label="Livro" required borderless  class="InP"/>
                <q-input v-model="newUser.date" label="Data de Lançamento" type="date" required borderless  class="InP"/>

                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar a Aluguel -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalRent Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="white"/>
            </q-card-section>

            <q-card-section>
              <q-input v-model="selectedUser.name" label="Nome do Usuário" required borderless  class="InP"/>
              <q-input v-model="selectedUser.book" label="Livro" required borderless  class="InP"/>
              <q-input v-model="selectedUser.date" label="Data de Lançamento" type="date" required borderless  class="InP"/>

              <q-btn label="Salvar" color="secondary" class="EditarButtom"/>
            </q-card-section>
          </q-card>
        </q-dialog>

         <!-- Modal para Devolução -->
         <q-dialog v-model="AbrirModalView" class="JmodalRent Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Registro de Devolução</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <q-input v-model="newUser.name" label="Nome do Usuário" required borderless  class="InP"/>
                <q-input v-model="newUser.date" label="Data de Devolução" type="date" required borderless  class="InP"/>

                <q-btn type="submit" label="Registrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import ConfirmDeleteImg from '../assets/No_Delete.png';
import { api } from 'src/boot/axios';

export default {
  setup() {
    // Estados para controle dos modais
    const JModalNew = ref(false);
    const AbrirModalView = ref(false);
    const AbrirModalEdit = ref(false);
    const AbrirDeleteModal = ref(false);

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
    };

    const returnItem = (row) => {
      console.log('Devolução:', row);
      selectedUser.value = row;
      AbrirModalView.value = true;
    };

    const editItem = (row) => {
      console.log('Editando:', row);
      selectedUser.value = row;
      AbrirModalEdit.value = true;
    };

    const deleteItem = (row) => {
      console.log('Deletando:', row);
      selectedUser.value = row;
      AbrirDeleteModal.value = true;
    };

    // Dados para a tabela
    const tableColumns = ref([
      { name: 'renterName', label: 'Locatário', align: 'center', field: row => row.renterName },
      { name: 'bookName', label: 'Livro alugado', align: 'center', field: row => row.bookName },
      { name: 'status', label: 'status', align: 'center', field: row => row.status },
      { name: 'deadLineDate', label: 'Data Limite', align: 'center', field: row => row.deadLineDate },
      { name: 'rentDate', label: 'Data do Aluguel', align: 'center', field: row => row.rentDate },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([]);

     // Função para buscar todos as editoras de uma vez
     const PagesRent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/rent`, {
          params: { size: 1000, sort: 'id', direction: 'ASC' },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifique se há dados na resposta
        if (response.data && response.data.content) {
          tableData.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }
      } catch (error) {
        console.error('Erro ao buscar Alugueis:', error.response?.data || error.message);
      }
    };

        // Chame `BuscarUser` ao montar
        onMounted(() => {
          PagesRent();
        });

    const selectedUser = ref(null);
      const newUser = ref({
        publisher: '',
        email: '',
        telephone:'',
        site:'',
      });
    const password = ref('');

    return {
      JModalNew,
      AbrirModalView,
      AbrirModalEdit,
      AbrirDeleteModal,
      openModalNew,
      returnItem,
      editItem,
      deleteItem,
      tableData,
      tableColumns,
      selectedUser,
      newUser,
      password,
      ConfirmDeleteImg
    };
  }
};
</script>

<style>
.PPage {
  margin: 30px 60px 0px 70px;
}

.TCima {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.JmodalRent {
  backdrop-filter: blur(3px);
}

.JmodalRent .CardSectionTitulo {
  background-color: #333333;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-radius: 15px !important;
}

.JmodalRent .tituloModal {
  color: white;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.JmodalRent .ModalCard {
  background-color: #82E2E9;
  width: 420px;
  border: 2px solid black;
  border-radius: 20px;
}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalRent .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 1px black;
  padding-left: 10px;
}

.JmodalRent .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.JmodalRent .CadastroButtom {
  margin-left: 130px;
  margin-top: 25px;
  margin-bottom: 10px;
}

.EditarButtom{
  margin-left: 150px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.padding_zero{
  padding: 0px;
}

</style>
