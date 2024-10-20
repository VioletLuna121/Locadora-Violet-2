<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}"/>

        <!-- Modal para Novo Locatário -->
        <q-dialog v-model="JModalNew" class="JmodalRenter Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Locatário</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <div class="form">
                  <div>
                    <q-input v-model="newUser.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="newUser.email" label="Email" type="email" required borderless  class="InP"/>
                    <q-input v-model="newUser.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="newUser.address" label="Endereço" required borderless  class="InP"/>
                    <q-input v-model="newUser.cpf" label="CPF" borderless  class="InP"/>
                  </div>
                </div>
                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Livro -->
        <q-dialog v-model="AbrirModalView" class="JmodalRenter Sombra" persistent>
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
                    <q-input v-model="selectedUser.email" label="Email" type="email" disable borderless  class="InP"/>
                    <q-input v-model="selectedUser.telephone" label="Telefone" type="tel" disable borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="selectedUser.address" label="Endereço" disable borderless  class="InP"/>
                    <q-input v-model="selectedUser.cpf" label="CPF"  disable borderless  class="InP"/>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar a Livro -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalRenter Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo CardST2">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="white"/>
            </q-card-section>

            <q-card-section>
              <q-form>
                <div class="form">
                  <div>
                    <q-input v-model="selectedUser.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="selectedUser.email" label="Email" type="email" required borderless  class="InP"/>
                    <q-input v-model="selectedUser.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="selectedUser.address" label="Endereço" required borderless  class="InP"/>
                    <q-input v-model="selectedUser.cpf" label="CPF" borderless  class="InP"/>
                  </div>
                </div>
                <q-btn type="submit" label="Cadastrar" color="secondary" class="CadastroButtom"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDeleteModal" class="DeleteModal JmodalRenter Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você realmente deseja deletar este Locatário?</p>
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
      { name: 'telephone', label: 'Telefone', align: 'center', field: row => row.telephone },
      { name: 'address', label: 'Endereço', align: 'center', field: row => row.address },
      { name: 'cpf', label: 'CPF', align: 'center', field: row => row.cpf },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([
      { id: 1, name: 'Sabrina Dayse	', email: 'brina@gmail.com', telephone: '85 9159-6051', address: 'Rua José Goiana AP 17	',cpf:'298.696.876.96' },
      { id: 2, name: 'Francisco Igor	', email: 'guistico12@gmail.com	', telephone: '85 8764-7048', address: 'Av. Duque de Caxias',cpf:'869.422.535.45' },
      { id: 3, name: 'Lucas Pereira', email: 'lucas.pereira87@gmail.com', telephone: '(11) 91234-5678	', address: 'Rua das Flores...',cpf:'123.456.232.45' },
      { id: 4, name: 'Ana Beatriz', email: 'ana.costa01@gmail.com', telephone: '(41) 92345-6789	', address: 'Avenida Paraná, 321...',cpf:'345.678.343.34' },

    ]);

    const selectedUser = ref(null);
    const newUser = ref({
      name: '',
      email: '',
      telephone:'',
      address:'',
      cpf:'',
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

.JmodalRenter {
  backdrop-filter: blur(3px);
}

.JmodalRenter .CardSectionTitulo {
  background-color: #333333;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-radius: 15px !important;
}

.CardST2{
  padding-left: 100px
}

.JmodalRenter .tituloModal {
  color: white;
  width: 100%;
  display: flex;
  justify-content: center;
}

.JmodalRenter .ModalCard {
  background-color: #82E2E9;
  min-width: 50%;
  border: 2px solid black;
  border-radius: 20px;
}

.JmodalRenter .form{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 25px;

}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalRenter .InP {
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

.InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.CadastroButtom {
  margin-left: 40%;
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

</style>
