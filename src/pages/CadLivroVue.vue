<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom" v-if="user.role === 'ADMIN'"/>
          <BarraPesquisa class="BPesquisa"  v-model="BPesquisarBook" @input="PagesBook"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}" :user-type="'VISITOR'" />

        <!-- Modal para Novo Livro -->
        <q-dialog v-model="JModalNew" class="JmodalBook Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Livro</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section style="padding-top: 5px;">
              <q-form>
                <div class="form">
                  <div style="width: 250px;">
                    <q-input v-model="newBook.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="newBook.author" label="Autor" required borderless  class="InP"/>
                    <q-input v-model="newBook.totalQuantity" label="Quantidade" type="number" min="1" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="newBook.launchDate" label="Data de Lançamento" type="date" required borderless  class="InP"/>
                    <q-select
                    v-model="newBook.publisherId"
                    :options="publishers"
                    option-label="name"
                    option-value="id"
                    emit-value
                    map-options
                    label="Editora"
                    class="InP"
                    borderless
                    required/>
                  </div>
                </div>
                <q-btn type="submit" label="Cadastrar" class="CadastroButtom" @click="CadBook"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Livro -->
        <q-dialog v-model="AbrirModalView" class="JmodalBook Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados do Livro</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section style="padding-top: 5px;">
              <q-form>
                <div class="form">
                  <div style="width: 270px;">
                    <q-input v-model="DadosBook.name" label="Nome" disable borderless  class="InP"/>
                    <q-input v-model="DadosBook.author" label="Autor" disable borderless  class="InP"/>
                    <q-input v-model="DadosBook.availableQuantity" label="Quant. Disponivel" disable borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="DadosBook.inUseQuantity" label="Alugados" disable borderless  class="InP"/>
                    <q-input v-model="DadosBook.launchDate" label="Data de Lançamento" type="date"  disable borderless  class="InP"/>
                    <q-input v-model="DadosBook.publisherName" label="Editora" disable borderless  class="InP"/>
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
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section style="padding-top: 5px;">
              <q-form>
                <div class="form">
                  <div style="width: 270px;">
                    <q-input v-model="selectedBook.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="selectedBook.author" label="Autor" required borderless  class="InP"/>
                    <q-input v-model="selectedBook.totalQuantity" label="Estoque" type="number" min="1" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="selectedBook.launchDate" label="Data de Lançamento" type="date" required borderless class="InP"/>
                    <q-select
                    v-model="selectedBook.publisherId"
                    :options="publishers"
                    option-label="name"
                    option-value="id"
                    emit-value
                    map-options
                    label="Editora"
                    class="InP"
                    borderless
                    required/>
                  </div>
                </div>
                <q-btn label="Editar" class="CadastroButtom" @click="EditarBook"/>
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
                <q-btn label="Sim" color="red" class="Button" @click="deletarBook"/>
                <q-btn label="Não" color="dark" @click="AbrirDeleteModal = (false)" class="Button"/>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-card-section  class="PaginacaoContainer q-px-md q-py-sm"
        style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <q-btn flat icon="arrow_left" class="Paginacao icon-larger" @click="backPage" aria-label="Página anterior"></q-btn>
          <q-btn flat icon="arrow_right"  class="Paginacao icon-larger" @click="nextPage" aria-label="Próxima página"></q-btn>
        </q-card-section>
      </q-page>

    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, watch  } from 'vue';
import ConfirmDeleteImg from '../assets/No_Delete.png';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

export default {
  setup() {
    // Estados para controle dos modais
    const JModalNew = ref(false);
    const AbrirModalView = ref(false);
    const AbrirModalEdit = ref(false);
    const AbrirDeleteModal = ref(false);
    const BPesquisarBook = ref('');

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
      BuscarEditoras();
    };

    const viewItem = (row) => {
      BuscarDadosBook(row.id);
      selectedBook.value = row;
      AbrirModalView.value = true;
    };

    const editItem = (row) => {
      console.log('Editando:', row);
      selectedBook.value = row;
      AbrirModalEdit.value = true;
      BuscarEditoras();
    };

    const deleteItem = (row) => {
      console.log('Deletando:', row);
      selectedBook.value = row;
      AbrirDeleteModal.value = true;
    };

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

    // Dados para a tabela
    const tableColumns = ref([
      { name: 'id', label: 'ID', align: 'center', field: row => row.id },
      { name: 'name', label: 'Nome', align: 'center', field: row => row.name },
      { name: 'author', label: 'Autor', align: 'center', field: row => row.author },
      { name: 'totalQuantity', label: 'Estoque', align: 'center', field: row => row.totalQuantity },
      { name: 'availableQuantity', label: 'Quant. Disponiveis', align: 'center', field: row => row.availableQuantity },
      { name: 'inUseQuantity', label: 'Alugados', align: 'center', field: row => row.inUseQuantity },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([]);

    const currentPage = ref(0);

    // Função para buscar todos as editoras de uma vez
    const PagesBook = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/book`, {
          params: {  size: 7, page: currentPage.value, sort: 'id', direction: 'ASC',search:BPesquisarBook.value},
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifique se há dados na resposta
        if (response.data && response.data.content) {
          tableData.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }
      } catch (error) {
    // Exibir mensagem de erro
    const errorMessage =
      error.response?.data?.message || 'Erro ao carregar Livros.';
    Notify.create({
      type: 'negative',
      message: `${errorMessage}`,
      position: 'bottom-right',
      timeout: 1500,
    });
  }
    };

        // Chame `BuscarUser` ao montar
        onMounted(() => {
          PagesBook();
          userValid();
        });

        watch(BPesquisarBook, () => {
          PagesBook(); // Recarrega a pesquisa sempre que o termo for alterado
        });

    const CadBook = async () => {
      try {
        const token = localStorage.getItem('token');

        console.log("Dados de cadastro do livro:", {
          name: newBook.value.name,
          author: newBook.value.author,
          totalQuantity: newBook.value.totalQuantity,
          launchDate: newBook.value.launchDate,
          publisherId: newBook.value.publisherId,
         });

        const response = await api.post('/book',{

          name: newBook.value.name,
          author: newBook.value.author,
          totalQuantity: newBook.value.totalQuantity,
          launchDate: newBook.value.launchDate,
          publisherId: newBook.value.publisherId,

        },
        {
          headers: {Authorization: `Bearer ${token}`}
        }
        );

        if (response.status === 201) {

        // Fechar o modal e limpar o formulário
        JModalNew.value = false;
        newBook.value = {
          name: '',
          author: '',
          totalQuantity:'',
          launchDate:'',
          publisherId:'', };
        }

        Notify.create({
            type: 'positive',
            message: 'Livro cadastrado com sucesso!',
            position: 'bottom-right',
            timeout: 1500,
          });
        await PagesBook();
      } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Erro ao cadastrar Livro.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
    };

    const DadosBook = ref({}); // Inicializado como objeto vazio para evitar problemas de acesso

    const BuscarDadosBook = async (bookID) => {
  try {
    console.log("Buscando dados do livro com ID:", bookID);
    const token = localStorage.getItem('token');
    const response = await api.get(`/book/${bookID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    DadosBook.value = response.data;
    console.log("Dados do livro carregados:", DadosBook.value);

    Notify.create({
      type: 'positive',
      message: 'Dados do Livro',
      position: 'bottom-right',
      timeout: 1500,
    });

    AbrirModalView.value = true;
    } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Erro ao carregar dados.';
        Notify.create({
          type: 'negative',
          message: `Erro ao carregar usuários: ${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
  };

    const EditarBook = async () => {
        try {
          const token = localStorage.getItem('token');

          // Chamada PUT para atualizar o usuário
          const response = await api.put(`/book`,{

              id: selectedBook.value.id,
              name: selectedBook.value.name,
              author: selectedBook.value.author,
              totalQuantity: selectedBook.value.totalQuantity,
              launchDate: selectedBook.value.launchDate,
              publisherId: selectedBook.value.publisherId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

            // Verifica se a atualização foi bem-sucedida
            if (response.status === 204) {
              console.log('Editora atualizada com sucesso.');
              AbrirModalEdit.value = false; // Fecha o modal de edição
              await PagesBook(); // Atualiza a lista de usuários
            } else {
              console.warn('A API retornou um status inesperado:', response.status);
            }

            Notify.create({
              type: 'positive',
              message: 'Livro editado com sucesso!',
              position: 'bottom-right',
              timeout: 1500,
            });
          } catch (error) {
          // Exibir mensagem de erro
          const errorMessage =
            error.response?.data?.message || 'Erro ao editar Livro.';
          Notify.create({
            type: 'negative',
            message: `${errorMessage}`,
            position: 'bottom-right',
            timeout: 1500,
          });
        }
        };

        const deletarBook = async () => {
        try {
          const token = localStorage.getItem('token');
          const bookID = selectedBook.value?.id;

          if (!bookID) {
            console.error('Erro: ID do livro não encontrado para exclusão.');
            return;
          }
          console.log(`Iniciando exclusão do livro com ID: ${bookID}`);

          // Chamada para exclusão do livro
          const response = await api.delete(`/book/${bookID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 204) {
            console.log('Livro excluída com sucesso.');
            AbrirDeleteModal.value = false; // Fecha o modal de exclusão
            await PagesBook(); // Atualiza a lista do livro
          } else {
            console.warn(`A API retornou um status inesperado: ${response.status}`);
          }

          Notify.create({
            type: 'positive',
            message: 'Locatário deletada com sucesso!',
            position: 'bottom-right',
            timeout: 1500,
          });
        } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Erro ao deletar Livro.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
      };

      const publishers = ref([]);

      const BuscarEditoras = async () => {
        try {
          const token = localStorage.getItem('token');

          console.log(publishers.value)

          const response = await api.get(`/publisher`, {
          params: { size: 1000 },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.content) {
          publishers.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }

        } catch (error) {
          console.error('Erro ao buscar editoras:', error);
        }
      };

      onMounted(() => {
        BuscarEditoras();
      });

    const selectedBook = ref(null);
    const newBook = ref({
      name: '',
      author: '',
      totalQuantity:'',
      launchDate:'',
      publisherId:'',
    });
    const password = ref('');

    const nextPage = () => {
      currentPage.value++;
      PagesBook();
    };

    const backPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
        PagesBook();
      }
    };

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
      selectedBook,
      newBook,
      password,
      ConfirmDeleteImg,
      PagesBook,
      CadBook,
      BuscarDadosBook,
      EditarBook,
      DadosBook,
      deletarBook,
      publishers,
      BuscarEditoras,
      BPesquisarBook,
      user,
      backPage,
      nextPage

    };
  }
};
</script>

<style>
.PPage {
  margin: 30px 60px 0px 70px;
  height: 100px;
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
  background-color: white;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-radius: 15px !important;
}
.JmodalBook .tituloModal {
  color: black;
  width: 100%;
  display: flex;
  justify-content: center;
}

.JmodalBook .ModalCard {
  background-color: white;
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
  border: solid 2px rgba(0, 0, 0, 0.550);
  padding-left: 10px;
  width: 230px;
  height: 50px;
}

.JmodalBook .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.JmodalBook .CadastroButtom {
  margin-left: 40%;
  margin-bottom: 10px;
  margin-top: 0px;
  background-color: #82e2e9;
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

.Paginacao{
  color: #333333;
  border: solid 1px rgba(0, 0, 0, 0.795);
  height: 40px;
  width: 50px;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.479);

}

.icon-larger .q-icon {
  font-size: 40px; /* Ajuste o tamanho do ícone */
  display: flex;
  position: relative;
  bottom: 5px;
}

</style>
