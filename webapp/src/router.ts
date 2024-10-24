import { createMemoryHistory, createRouter } from "vue-router";

import LoginPage from "./pages/LoginPage.vue";

const routes = [
    {path: '/', component: LoginPage}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router