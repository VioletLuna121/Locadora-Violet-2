<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}"/>

        <!-- Modal para Novo Usuário -->
        <q-dialog v-model="JModalNew" class="JmodalUser Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Usuário</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <q-input v-model="newUser.name" label="Nome" required borderless  class="InP"/>
                <q-input v-model="newUser.email" label="Email" type="email" required borderless  class="InP"/>
                <PasswordInput label="Senha" class="InP" v-model="password" borderless />

                <!-- Checkboxes de Permissão -->
                <div class="q-gutter-md permission">
                  <q-radio v-model="newUser.permissions" val="leitor" label="Leitor" color="dark"/>
                  <q-radio v-model="newUser.permissions" val="editor" label="Editor" color="dark"/>
                </div>

                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Usuário -->
        <q-dialog v-model="AbrirModalView" class="JmodalUser Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados do Usuário</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-input v-model="selectedUser.name" label="Nome" borderless class="InP" disable />
              <q-input v-model="selectedUser.email" label="Email" type="email" borderless class="InP" disable />
              <q-input v-model="selectedUser.password" label="Senha" type="text" borderless class="InP" disable />
              <q-input v-model="selectedUser.permission" label="Permissão" borderless class="InP InputView" disable />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar Usuário -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalUser Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo CardST2">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="white"/>
            </q-card-section>

            <q-card-section>
              <q-input v-model="selectedUser.name" label="Nome" borderless class="InP"/>
              <q-input v-model="selectedUser.email" label="Email" type="email" borderless class="InP"/>
              <PasswordInput label="Senha" class="InP" v-model="selectedUser.password" borderless />

              <div class="q-gutter-md permission">
                <q-radio v-model="selectedUser.permission" val="leitor" label="Leitor" color="dark"/>
                <q-radio v-model="selectedUser.permission" val="editor" label="Editor" color="dark"/>
              </div>

              <q-btn label="Salvar" color="secondary" class="EditarButtom"/>
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
                <q-btn label="Sim" color="red" class="Button"/>
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
import { ref } from 'vue';
import ConfirmDeleteImg from '../assets/No_Delete.png';

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

    const viewItem = (row) => {
      console.log('Visualizando:', row);
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
      { name: 'name', label: 'Nome', align: 'center', field: row => row.name },
      { name: 'email', label: 'Email', align: 'center', field: row => row.email },
      { name: 'permission', label: 'Permissão', align: 'center', field: row => row.permission },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([
      { id: 1, name: 'João', email: 'joao@gmail.com', permission: 'leitor', password: 'joao123' },
      { id: 2, name: 'Maria', email: 'maria@gmail.com', permission: 'editor', password: 'maria123' },
    ]);

    const selectedUser = ref(null);
    const newUser = ref({
      name: '',
      email: '',
      permissions: {
        leitor: false,
        editor: false
      }
    });
    const password = ref('');

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

.JmodalUser {
  backdrop-filter: blur(3px);
}

.JmodalUser .CardSectionTitulo {
  background-color: #333333;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-left: 65px;
  padding-top: 10px;
  border-radius: 15px !important;
}

.CardST2{
  padding-left: 100px
}

.JmodalUser .tituloModal {
  color: white;
  width: 100%;
}

.JmodalUser .ModalCard {
  background-color: #82E2E9;
  width: 420px;
  border: 2px solid black;
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
  border: solid 1px black;
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

.CadastroButtom {
  margin-left: 130px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.EditarButtom{
  margin-left: 150px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.DeleteModal {
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

.textDelete {
  color: black;
  font-weight: bold;
  font-size: 17px;
  text-align: center;

}

.DeleteImg {
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
