<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="MiniModais">
          <!-- Retângulo de Atrasados -->
          <q-card class="box">
              <div class="content">
                <div>
                  <div class="number">12</div>
                  <div class="textBox">Atrasados</div>
                </div>
                <div class="icon">
                  <q-icon name="warning" size="44px" color="red"></q-icon> <!-- Ícone de Atrasados -->
                </div>
              </div>
          </q-card>

            <!-- Retângulo de Empréstimos -->
          <q-card class="box">
            <div class="content">
              <div>
                <div class="number">35</div>
                <div class="textBox">Empréstimos</div>
              </div>
              <div class="icon">
                <q-icon name="library_books" size="44px" color="blue"></q-icon> <!-- Ícone de Empréstimos -->
              </div>

            </div>
          </q-card>

              <!-- Ícone de Devolvidos -->
            <q-card class="box">
            <div class="content">
              <div>
                <div class="number">23</div>
                <div class="textBox">Devolvidos</div>
              </div>
              <div class="icon">
                <q-icon name="beenhere" size="44px" color="green"></q-icon>  <!-- Ícone de Devolvidos -->
              </div>

            </div>
          </q-card>

                <!-- Retângulo de Livros -->
                <q-card class="box">
            <div class="content">
              <div>
                <div class="number">150</div>
                <div class="textBox">Devolvidos</div>
              </div>
              <div class="icon">
                <q-icon name="book" size="44px" color="brown"></q-icon> <!-- Ícone de Livros -->
              </div>

            </div>
          </q-card>
        </div>

        <div class="Conteudo">
          <TabelaGeral :rows="tableData" :columns="tableColumns" :rows-per-page="6" class="TGeral"/>
          <GraficoBarras class="Grafico"/>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  // name: 'PageName',
  setup(){

    const tableColumns = ref([
      { name: 'user', label: 'Usuário', align: 'center', field: row => row.user },
      { name: 'rent', label: 'Alugueis', align: 'center', field: row => row.rent },
      { name: 'loan', label: 'Empréstimos', align: 'center', field: row => row.loan },
      { name: 'best', label: 'Top 6 livros mais alugados', align: 'center', field: row => row.best }
    ]);

    const tableData = ref([
      { id: 1, user: 'Brinakkjj	', rent: '1', loan: '0', best: 'joao123', },
      { id: 2, user: 'Guistico', rent: '1', loan: '1', best: 'maria123' },
      { id: 3, user: 'Julinha', rent: '2', loan: '0', best: 'maria123' },
      { id: 4, user: 'Carmila', rent: '1', loan: '0', best: 'maria123' },
      { id: 5, user: 'Mariana123', rent: '1', loan: '1', best: 'maria123' },
      { id: 6, user: 'Mariana123', rent: '1', loan: '1', best: 'maria123' },
      { id: 7, user: 'Mariana123', rent: '1', loan: '1', best: 'maria123' },
      { id: 8, user: 'Mariana123', rent: '1', loan: '1', best: 'maria123' },
    ]);

    return{
      tableColumns,
      tableData
    }

  }
}
</script>

<style>
.box {

  width: 190px;
  height: 70px;
  padding-left: 15px; /* Adiciona espaçamento interno */
  padding-right: 10px;
  border-radius: 5px !important;
  border: solid 1px black !important;
}

.content {
  display: flex;
  justify-content: space-between; /* Coloca o número e o ícone nas extremidades */
  align-items: center; /* Alinha verticalmente no centro */
  height: 100%;
}

.number {
  margin-left: 8px;
  display: flex;
  top: 10px;
  height: 36px;
  font-size: 25px;
  font-weight: bold;
}

.textBox{
  display: flex;
  bottom: 10px;
  height: 30px;
  font-size: 16px;
  font-weight: 500;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.MiniModais{
  margin-top: 20px;
  margin-left: 45px;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 73px;
}

.Grafico{
  width: 43%;
  height: auto;
  margin-top: 20px;

}

.Conteudo .TGeral{
  height: 390px;
  width: 50%;
  margin-left: 20px;
  margin-top: 20px;
  margin-right: 20px;
  overflow-x: hidden;
}

.Conteudo{
  display: flex;
  flex-direction: row;
  margin-top: 30px;
}

.q-table tbody:nth-child(4) {
  background-color: #333333;
  color: white;
  font-weight: bold;
}


</style>
