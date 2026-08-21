import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Handle GitHub Pages 404 redirect
const redirectPath = sessionStorage.getItem("redirectPath")
if (redirectPath) {
  sessionStorage.removeItem("redirectPath")
  router.push(redirectPath)
}

createApp(App).use(router).mount('#app')

