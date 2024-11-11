<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}"/>

        <!-- Modal para Novo Livro -->
        <q-dialog v-model="JModalNew" class="JmodalBook Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Livro</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <div class="form">
                  <div>
                    <q-input v-model="newUser.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="newUser.publisher" label="Editora" required borderless  class="InP"/>
                    <q-input v-model="newUser.author" label="Autor" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="newUser.date" label="Data de Lançamento" type="date" required borderless  class="InP"/>
                    <q-input v-model="newUser.stock" label="Estoque" type="number" min="0" borderless  class="InP"/>
                  </div>
                </div>
                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Livro -->
        <q-dialog v-model="AbrirModalView" class="JmodalBook Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados do Livro</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <div class="form">
                  <div>
                    <q-input v-model="selectedUser.name" label="Nome" disable borderless  class="InP"/>
                    <q-input v-model="selectedUser.publisher" label="Editora" disable borderless  class="InP"/>
                    <q-input v-model="selectedUser.author" label="Autor" disable borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="selectedUser.date" label="Data de Lançamento" type="date" disable borderless  class="InP"/>
                    <q-input v-model="selectedUser.stock" label="Estoque" type="number" min="0" disable borderless  class="InP"/>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar a Livro -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalBook Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <div class="form">
                  <div>
                    <q-input v-model="selectedUser.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="selectedUser.publisher" label="Editora" required borderless  class="InP"/>
                    <q-input v-model="selectedUser.author" label="Autor" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="selectedUser.date" label="Data de Lançamento" type="date" required borderless  class="InP"/>
                    <q-input v-model="selectedUser.stock" label="Estoque" type="number" min="0" borderless  class="InP"/>
                  </div>
                </div>
                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDeleteModal" class="DeleteModal JmodalBook Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você realmente deseja deletar este Livro?</p>
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
      { name: 'publisher', label: 'Editora', align: 'center', field: row => row.publisher },
      { name: 'author', label: 'Autor', align: 'center', field: row => row.author },
      { name: 'date', label: 'Data de Lançamento', align: 'center', field: row => row.date },
      { name: 'stock', label: 'Estoque', align: 'center', field: row => row.stock },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([
      { id: 1, name: 'Quinze Dias	', publisher: 'Globo Alt ', author: 'Vitor Martins	', date: '02/06/2017',stock:'2' },
      { id: 2, name: '1984', publisher: '	Companhia das Letras	', author: 'George Orwell', date: '08/06/1949',stock:'3' },
      { id: 3, name: 'Dom Quixote', publisher: 'Editora 34', author: '	Miguel de Cervantes', date: '16/01/1605',stock:'7' },
      { id: 4, name: 'Cem Anos de Solidão	', publisher: 'Record', author: 'Gabriel García Márquez', date: '30/05/1967',stock:'3' },

    ]);

    const selectedUser = ref(null);
    const newUser = ref({
      name: '',
      publisher: '',
      author:'',
      date:'',
      stock:'',
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

.JmodalBook {
  backdrop-filter: blur(3px);
}

.JmodalBook .CardSectionTitulo {
  background-color: #333333;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-radius: 15px !important;
}
.JmodalBook .tituloModal {
  color: white;
  width: 100%;
  display: flex;
  justify-content: center;
}

.JmodalBook .ModalCard {
  background-color: #82E2E9;
  min-width: 50%;
  border: 2px solid black;
  border-radius: 20px;
}

.JmodalBook .form{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 25px;

}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalBook .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 1px black;
  padding-left: 10px;
  width: 250px;
  height: 55px;
}

.JmodalBook .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.CadastroButtom {
  margin-left: 40%;
  margin-bottom: 10px;
  margin-top: 0px;
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

</style>
