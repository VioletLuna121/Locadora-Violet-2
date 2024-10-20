<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}"/>

        <!-- Modal para Nova Editora -->
        <q-dialog v-model="JModalNew" class="JmodalPublisher Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Editora</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <q-input v-model="newUser.publisher" label="Editora" required borderless  class="InP"/>
                <q-input v-model="newUser.email" label="Email" type="email" required borderless  class="InP"/>
                <q-input v-model="newUser.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
                <q-input v-model="newUser.site" label="Site"  borderless  class="InP"/>

                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Editora -->
        <q-dialog v-model="AbrirModalView" class="JmodalPublisher Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados da Editora</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section class="marginBottom">
              <q-input v-model="selectedUser.publisher" label="Editora" borderless class="InP" disable />
              <q-input v-model="selectedUser.email" label="Email" type="email" borderless class="InP" disable />
              <q-input v-model="selectedUser.telephone" label="Telefone" type="tel" borderless class="InP" disable />
              <q-input v-model="selectedUser.site" label="Site" borderless class="InP InputView" disable />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar a Editora -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalPublisher Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo CardST2">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="white"/>
            </q-card-section>

            <q-card-section>
              <q-input v-model="selectedUser.publisher" label="Editora" required borderless  class="InP"/>
              <q-input v-model="selectedUser.email" label="Email" type="email" required borderless  class="InP"/>
              <q-input v-model="selectedUser.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
              <q-input v-model="selectedUser.site" label="Site"  borderless  class="InP"/>

              <q-btn label="Salvar" color="secondary" class="EditarButtom"/>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDeleteModal" class="DeleteModal JmodalPublisher Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você realmente deseja deletar esta Editora?</p>
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
      { name: 'publisher', label: 'Editora', align: 'center', field: row => row.publisher },
      { name: 'email', label: 'Email', align: 'center', field: row => row.email },
      { name: 'telephone', label: 'Telefone', align: 'center', field: row => row.telephone },
      { name: 'site', label: 'Site', align: 'center', field: row => row.site },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([
      { id: 1, publisher: 'Seu jorge', email: 'seujorge@gmail.com', telephone: '85997007530', site: 'https://seujorge.com' },
      { id: 2, publisher: 'Globo Alt', email: 'globoalt@gmail.com', telephone: '(11) 4003-9393', site: 'https://www.companhiadasletras.com.br/' },
      { id: 3, publisher: 'Editora 34	', email: 'contato@editora34.com.br', telephone: '+55 11 3315-3322', site: 'http://127.0.0.1:5500/html/editora34.com.br' },
      { id: 4, publisher: 'Intrínseca', email: 'atendimento@intrinseca.com.br', telephone: '+55 21 2220-6767	', site: 'http://127.0.0.1:5500/html/intrinseca.com.br' },

    ]);

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

.JmodalPublisher {
  backdrop-filter: blur(3px);
}

.JmodalPublisher .CardSectionTitulo {
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

.JmodalPublisher .tituloModal {
  color: white;
  width: 100%;
}

.JmodalPublisher .ModalCard {
  background-color: #82E2E9;
  width: 420px;
  border: 2px solid black;
  border-radius: 20px;
}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalPublisher .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 1px black;
  padding-left: 10px;
}

.JmodalPublisher .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.CadastroButtom {
  margin-left: 130px;
  margin-top: 25px;
  margin-bottom: 10px;
}

.EditarButtom{
  margin-left: 150px;
  margin-top: 20px;
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

.marginBottom{
  margin-bottom: 20px;
  
}

</style>
