import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import useElementPlus from './utils/element'

const app = createApp(App)
useElementPlus(app)
app.use(router)
app.mount('#app')
