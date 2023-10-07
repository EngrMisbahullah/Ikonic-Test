<template>
    <div class="container">
      <form @submit.prevent="userLogin">
        <h2>Login Form</h2>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="first">Email</label>
              <input v-model="v$.email.$model" class="form-control" placeholder="" id="first">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="last">Password</label>
              <input type="password" v-model="v$.password.$model" class="form-control" placeholder="" id="last">
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { required } from "@vuelidate/validators";
  import { useVuelidate } from "@vuelidate/core";
  import { useAuthStore } from '../../../store/auth.js';

  const router = useRouter();
  const authStore = useAuthStore();

  const form = ref({
    email:  '',
    password: '',
  });

const rules = {
    email: {
        required: true
    },
    password: {
        required: true
    }
}

const v$ = useVuelidate(rules, form);

  async function userLogin() {
    console.log("form Data",form.value.email);
    try {
      const response = await authStore.login(form.value.email, form.value.password); // Access email as form.email.value
      console.log('User',response.user)
      if (response && response.success) {
        // Login successful, you can redirect or perform any action here
        console.log('Success');
        router.push('/add/feedback');
      } else {
        // Login failed, handle the error accordingly
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  </script>

  <style scoped>
  </style>
