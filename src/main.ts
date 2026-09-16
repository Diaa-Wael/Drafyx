import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { i18n } from '@mlightcad/cad-viewer'
import App from './App.vue'
import './styles.css'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
