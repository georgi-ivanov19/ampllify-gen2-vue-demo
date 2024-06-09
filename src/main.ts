import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import AmplifyVue from '@aws-amplify/ui-vue'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import '@aws-amplify/ui-vue/styles.css'

Amplify.configure(outputs)

const app = createApp(App)

app.use(router)
app.use(AmplifyVue)
app.mount('#app')
