import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ApiService from "../services/ApiService";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(null);
    const user = ref(null);

    // check if token is in local storage
    if (localStorage.getItem("token")) {

        token.value = localStorage.getItem("token");
    }

    // check if user is in local storage
    if (localStorage.getItem("user")) {
        user.value = JSON.parse(localStorage.getItem("user"));
    }

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => {
        if(user.value)
        {
            return user.value.isAdmin;
        }else{
            userDetails();
            return user.value.isAdmin;
        }
    });

    const setToken = (tokenValue) => {
        if (tokenValue == null) {
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", tokenValue);
        }
        token.value = tokenValue;
    };

    const setUser = (userValue) => {
        if (userValue == null) {
            localStorage.removeItem("user");
        } else {
            localStorage.setItem("user", JSON.stringify(userValue));
        }
        user.value = userValue;
    };

    const userDetails = async () => {
        const headers = {
            'Authorization': `Bearer ${token.value}`
        }
        const body = {};
        const response = await ApiService.get("/api/user", body ,headers);
        if(response.success){
            // setToken(response.data.token);
            setUser(response.data.user);
        }
        return response;
    }

    // const userDetails = await ApiService.get("api/user", )

    const login = async (email, password) => {
        const response = await ApiService.post("/api/auth/login", {
            email,
            password,
        });
        console.log(response.data.token);
        if (response.success) {
            setToken(response.data.token);
            setUser(response.data.user);
        }
        return response;
    };
    const register = async (first_name, last_name, email, password) => {
        const response = await ApiService.post("/api/auth/register", {
            first_name,
            last_name,
            email,
            password,
        });
        if (response.success) {
            setToken(response.data.token);
            setUser(response.data.user);
        }
        return response;
    };

    const forgotPassword = async (email) => {
        const response = await ApiService.post("/api/forgot-password", {
            email,
        });
        return response;
    };

    const resetPassword = async (
        email,
        password,
        password_confirmation,
        token
    ) => {
        const response = await ApiService.post("/api/reset-password", {
            email,
            password,
            password_confirmation,
            token,
        });
        return response;
    };


    const flushUser = () => {
        setToken(null);
        setUser(null);
    };

    return {
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        forgotPassword,
        resetPassword,
        setToken,
        setUser,
        flushUser,
        userDetails
    };
});
