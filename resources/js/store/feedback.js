import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ApiService from "../services/ApiService";
import { useAuthStore } from "../store/auth";

export const useFeedbackStore = defineStore("feedback", () => {
    const authStore = useAuthStore();
    const headers = {
        'Authorization': `Bearer ${authStore.token}`,
    }

    const feedBackList = async (organization_id, per_page) => {
        const queryParams = {
            'per_page': per_page
        };
        const response = await ApiService.get(`/api/feedback/s`, {params: queryParams } ,headers);
        return response;
    };

    const feedBackListPaginated = async ( params = {}) => {
        const queryParams = {
            'page': params.currentPage || null,
            'search' : params.search || null,
            'sortBy': params.sortBy || null,
            'sortDirection': params.sortDirection || null,
            'inactive': params.inactive || 0,
        };

        const response = await ApiService.get(`/api/feedback/`, {params : queryParams} ,headers);
        return response;
    };

    const addFeedBack = async (data) => {
        console.log('Testing.....');
        console.log(headers);
        const response = await ApiService.post("/api/feedback/create", data, headers);
        return response;
    }

    const editFeedBack = async (id, data) => {
        const response = await ApiService.put(`/api/feedback/${id}/update`, data, headers);
        return response;
    }

    const getFeedBackDatabyId = async (id) => {
        const response = await ApiService.get(`/api/feedback/${id}/show`, headers)
        return response;
    }


    const feedBackDelete = async ( id ) => {
        const response = await ApiService.delete(`/api/feedback/${id}/delete` ,headers);
        return response;
    };

    const addUpVote = async ( id ) => {
        const response = await ApiService.post(`/api/feedback/${id}/upvote` ,headers);
        return response;
    };
    const downVote = async ( id ) => {
        const response = await ApiService.post(`/api/feedback/${id}/downvote` ,headers);
        return response;
    };



    return {
        feedBackList,
        feedBackListPaginated,
        addFeedBack,
        editFeedBack,
        getFeedBackDatabyId,
        feedBackDelete,
        addUpVote,
        downVote
    }
});
