import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
const routes = [

    {
        path: "/",
        component: () => import('../components/pages/frontend/MainLayout.vue'),
    },
    {
        path: "/login",
        component: () => import('../components/pages/frontend/Login.vue'),
        name : 'login',
    },
    {
        path:"/add/feedback",
        component: () => import('../components/pages/frontend/AddFeedback.vue'),
        name : "AddFeedback",
        meta: {
            auth: true,
        },
    },
    {
        path: "/panel",
        component: () => import('../components/pages/frontend/MainLayout.vue'),
        children: [
            {
                path: "/panel/dashboard",
                name: "Dashboard",
                component: () => import('../components/dashboard/Dashboard.vue'),
                meta: {
                    auth: true,
                },
            }
        ]
    },
    { path: "/:pathMatch(.*)*", component: () => import('../components/notfound/PageNotFound.vue') }


];
const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, form, next) => {
    const authStore = useAuthStore();
    if (to.meta.auth && !authStore.isAuthenticated ) {
        next({ name: "login" });
    }
    if (to.meta.guest && authStore.isAuthenticated ) {
        next({ name: "AddFeedback" });
    }
    if(to.name === 'setToken'){
        console.log('Testing');
        authStore.setToken(to.params.token);
        userDetails();
        async function userDetails() {
            let response = await authStore.userDetails();
            if (response) {
                if (!response.success) {
                    if (response.errors) {
                        for (let key in response.errors) {
                            let error = response.errors[key];
                            v$.value[key].$serverError = error
                        }
                    }
                    else if (response.message) {
                        alert(response.message);
                    }
                }else{

                    authStore.setUser(response.data.user)
                    router.push({name: 'AddFeedback'});
                }
            }
        };
    }
    next();
});


export default router;
