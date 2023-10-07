import axios from "axios";
import { ResponseWrapper } from "./util.js";

class ApiService {

    // static axios object with default properties
    static axios = axios.create({
        // baseURL: import.meta.env.VITE_APP_URL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // static method to set the default 'Authorization' header
    static setToken(token) {
        ApiService.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;
    }

    // static method to remove the default 'Authorization' header
    static removeToken() {
        ApiService.axios.defaults.headers.common["Authorization"] = null;
    }

    //method to add specific headers
    static addHeaders(headers) {
        ApiService.axios.defaults.headers.common = headers;
        if(headers['Content-Type']){
            ApiService.axios.defaults.headers['Content-Type'] = headers['Content-Type'];
        }
    }

    //set route with slash

    static setRoute = (resource) => {
        if(!resource.startsWith('/')){
            resource = resource.replace (/^/,'/');
        }
        if(resource.endsWith('/')){
            resource = resource.slice(0,-1);
        }
        return resource;
    };

    //set route with slash
    static setRoute = (resource) => {
        if(!resource.startsWith('/')){
            resource = resource.replace (/^/,'/');
        }
        if(resource.endsWith('/')){
            resource = resource.slice(0,-1);
        }
        return resource;
    };

    // static method to get a resource allow to pass a custom headers
    static async get(resource, data ,headers = null) {
        try {
            if (headers) {
                ApiService.addHeaders(headers);
            }
            resource = this.setRoute(resource)
            let response = await ApiService.axios.get(`${resource}`, data);
            if (!response.data.success) {
                return new ResponseWrapper(response);
            }
            return new ResponseWrapper(response);
        } catch (error) {
            return new ResponseWrapper(error, true);
        }
    }

    // static method to post a resource allow to pass a custom headers
    static async post(resource, data, headers = null) {
        try {
            if (headers) {
                ApiService.addHeaders(headers);
            }
            resource = this.setRoute(resource)
            let response = await ApiService.axios.post(`${resource}`, data);
            if (!response.data.success) {
                return new ResponseWrapper(response);
            }
            return new ResponseWrapper(response);
        } catch (error) {
            return new ResponseWrapper(error, true);
        }
    }

    // static method to update a resource allow to pass a custom headers
    static async put(resource, data, headers = null) {
        try {
            if (headers) {
                ApiService.addHeaders(headers);
            }
            resource = this.setRoute(resource)
            let response = await ApiService.axios.put(`${resource}`, data);
            if (!response.data.success) {
                return new ResponseWrapper(response);
            }
            return new ResponseWrapper(response);
        } catch (error) {
            return new ResponseWrapper(error, true);
        }
    }

    // static method to delete a resource allow to pass a custom headers
    static async delete(resource, headers = null) {
        try {
            if (headers) {
                ApiService.addHeaders(headers);
            }
            resource = this.setRoute(resource)
            let response = await ApiService.axios.delete(`${resource}`);
            if (!response.data.success) {
                return new ResponseWrapper(response);
            }
            return new ResponseWrapper(response);
        } catch (error) {
            return new ResponseWrapper(error, true);
        }
    }
}

export default ApiService;
