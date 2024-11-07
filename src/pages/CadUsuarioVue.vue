<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns"  class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}"/>

        <!-- Modal para Novo Usuário -->
        <q-dialog v-model="JModalNew" class="JmodalUser Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Usuário</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section>
              <q-form @submit.prevent="CadNovoUser">
                <q-input v-model="newUser.username" label="Nome" required borderless  class="InP"/>
                <q-input v-model="newUser.email" label="Email" type="email" required borderless  class="InP"/>
                <PasswordInput label="Senha" class="InP" v-model="newUser.password" borderless required/>

                <!-- Checkboxes de Permissão -->
                <div class="q-gutter-md permission">
                  <q-radio v-model="newUser.role" val="VISITOR" label="VISITOR" color="$primary"/>
                  <q-radio v-model="newUser.role" val="ADMIN" label="ADMIN" color="$primary"/>
                </div>

                <q-btn type="submit" label="Cadastrar"  class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Usuário -->
        <q-dialog v-model="AbrirModalView" class="JmodalUser Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados do Usuário</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section>
              <q-input v-model="DadosUser.id" label="ID" borderless class="InP" disable />
              <q-input v-model="DadosUser.name" label="Nome" borderless class="InP" disable />
              <q-input v-model="DadosUser.email" label="Email" type="email" borderless class="InP" disable />
              <q-input v-model="DadosUser.role" label="Permissão" borderless class="InP InputView" disable />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar Usuário -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalUser Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo CardST2">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section>
              <q-input v-model="selectedUser.username" label="Nome" borderless class="InP"/>
              <q-input v-model="selectedUser.email" label="Email" type="email" borderless class="InP"/>
              <PasswordInput label="Senha" class="InP" v-model="selectedUser.password" borderless />

              <div class="q-gutter-md permission">
                <q-radio v-model="selectedUser.permission" val="VISITOR" label="VISITOR" color="$primary"/>
                <q-radio v-model="selectedUser.permission" val="ADMIN" label="ADMIN" color="$primary"/>
              </div>

              <q-btn label="Salvar" class="EditarButtom"/>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDeleteModal" class="DeleteModal JmodalUser Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você realmente deseja deletar este Usuário?</p>
            </q-card-section>

            <q-card-section class=" q-gutter-sm q-pt-none CardButtonDelete">
              <div class="q-gutter-md buttonsDelete">
                <q-btn label="Sim" color="red" class="Button" @click="deletarUser"/>
                <q-btn label="Não" color="dark" @click="AbrirDeleteModal = (false)" class="Button"/>
              </div>
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

    const newUser = ref({
      username: '',
      email: '',
      password: '',
      role: 'VISITOR',
    });

    const tableData = ref([]);
    const tableColumns = ref([
      { name: 'id', label: 'ID', align: 'center', field: row => row.id },
      { name: 'name', label: 'Nome', align: 'center', field: row => row.name },
      { name: 'role', label: 'Permissão', align: 'center', field: row => row.role },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const totalPages = ref(0);
    const currentPage = ref(1); // Página inicial

    // Função para buscar todos os usuários de uma vez
    const BuscarUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/users`, {
          params: { size: 1000, sort: 'id', direction: 'ASC' }, // Define um valor alto para size
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifique se há dados na resposta
        if (response.data && response.data.content) {
          tableData.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error.response?.data || error.message);
      }
    };

        // Chame `fetchUsers` ao montar
        onMounted(() => {
          BuscarUser();
        });


    // Cadastro de novo usuário
    const CadNovoUser = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await api.post('/users',{

            name: newUser.value.username,
            email: newUser.value.email,
            password: newUser.value.password,
            role: newUser.value.role,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 201) {

          // Fechar o modal e limpar o formulário
          JModalNew.value = false;
          newUser.value = {
          username: '',
          email: '',
          password: '',
          role: 'USER' };
        }
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
      }
    };

    // Novo estado para armazenar os detalhes do usuário
    const DadosUser = ref({}); // Inicializado como objeto vazio para evitar problemas de acesso

    // Função para buscar os detalhes do usuário
    const BuscarDadosUser = async (userId) => {
      try {
        console.log("Buscando dados do usuário com ID:", userId); // Log para depuração
        const token = localStorage.getItem('token');
        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        DadosUser.value = response.data; // Armazena os detalhes do usuário
        console.log("Dados do usuário carregados:", DadosUser.value); // Log dos dados carregados

        // Abre o modal de visualização após carregar os dados
        AbrirModalView.value = true;
      } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error.response?.data || error.message);
      }
    };

    const deletarUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = selectedUser.value?.id; // Obtém o ID do usuário

        // Realiza a requisição de exclusão do usuário
        const response = await api.delete(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 204) {
          console.log('Usuário excluído com sucesso.');
          AbrirDeleteModal.value = false;
          await BuscarUser(); // Atualiza a lista de usuários
        } else {
          console.warn('A API retornou um status inesperado:', response.status);
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error.response?.data || error.message);
      }
    };

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
    };

    const viewItem = (row) => {
      console.log("Visualizando usuário:", row);
      selectedUser.value = row;
      AbrirModalView.value = true;
      BuscarDadosUser(row.id);
    };

    const editItem = (row) => {
      selectedUser.value = row;
      AbrirModalEdit.value = true;
    };

    const deleteItem = (row) => {
      selectedUser.value = row;
      AbrirDeleteModal.value = true;
    };

    const selectedUser = ref(null);

    return {
      JModalNew,
      AbrirModalView,
      AbrirModalEdit,
      AbrirDeleteModal,
      openModalNew,
      viewItem,
      editItem,
      deleteItem,
      tableData,
      tableColumns,
      selectedUser,
      newUser,
      ConfirmDeleteImg,
      CadNovoUser,
      totalPages,
      currentPage,
      BuscarUser,
      deletarUser,
      DadosUser,
      BuscarDadosUser

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

.JmodalUser {
  backdrop-filter: blur(3px);
}

.JmodalUser .CardSectionTitulo {
  background-color: white;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;

}


.JmodalUser .tituloModal {
  color: black;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.JmodalUser .ModalCard {
  background-color: #ffffff;
  width: 420px;
  border: 2px solid  rgba(0, 0, 0, 0.699);
  border-radius: 20px;
}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalUser .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 2px rgba(0, 0, 0, 0.550);
  padding-left: 10px;
}

.JmodalUser .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.permission {
  display:flex ;
  justify-content: center;
  margin-left: 10px;
  margin-top: 5px;
  padding-right: 30px;
  display: flex;
  gap: 25%;

}

.JmodalUser .CadastroButtom {
  margin-left: 130px;
  margin-top: 15px;
  margin-bottom: 10px;
  background-color: #82e2e9;
  color: black;
}

.JmodalUser .EditarButtom{
  margin-left: 150px;
  margin-top: 15px;
  margin-bottom: 10px;
  background-color: #82e2e9;
}

.JmodalUser .DeleteModal {
  backdrop-filter: blur(2px);
}

.DeleteModalCard {
  background-color: #ffffff;
  width: 400px;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid black;

}

.JmodalUser .textDelete {
  color: black;
  font-weight: bold;
  font-size: 17px;
  text-align: center;

}

.JmodalUser .DeleteImg {
  width: 200px;
  height: 200px;
}

.center{
 display: flex;
 align-items: center;
 justify-content: center;
}

.CardButtonDelete{
  width: 60%;
}

.buttonsDelete {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  display: flex;
  gap: 40px;

}

.Button{
  width: 100px;
}

.padding_zero{
  padding: 0px;
}

</style>
