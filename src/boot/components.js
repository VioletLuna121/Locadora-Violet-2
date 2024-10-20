import { boot } from 'quasar/wrappers'
import BarraPesquisa from 'src/components/BarraPesquisa.vue'
import GraficoBarras from 'src/components/GraficoBarras.vue'
import NovoButton from 'src/components/NovoButton.vue'
import PasswordInput from 'src/components/PasswordInput.vue'
import TabelaGeral from 'src/components/TabelaGeral.vue'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(( { app  }) => {
  app.component('PasswordInput', PasswordInput),
  app.component('NovoButton', NovoButton),
  app.component('BarraPesquisa',BarraPesquisa),
  app.component('TabelaGeral',TabelaGeral),
  app.component('GraficoBarras',GraficoBarras)
})
