<template>
    <div class="container">
        <form @submit.prevent="save()">
            <h2>Contact Us</h2>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="first">Title</label>
                        <input type="text" v-model="v$.title.$model" class="form-control" placeholder="" id="first">
                    </div>
                </div>
                <!--  col-md-6   -->
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="last">Description</label>
                        <input type="text" v-model="v$.contents.$model" class="form-control" placeholder="" id="last">
                    </div>
                </div>
                <!--  col-md-6   -->
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="company">Category</label>
                        <input type="text" v-model="v$.category.$model" class="form-control" placeholder="" id="company">
                    </div>
                </div>
            </div>
            <!--  row   -->
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
import { useFeedbackStore } from '../../../store/feedback.js';

const router = useRouter();
const authStore = useAuthStore();
const feedbackStore = useFeedbackStore();

const form = ref({
  title:  '',
  contents: '',
  category: ''
});

const rules = {
  title: {
      required: true
  },
  contents: {
      required: true
  },
  category: {
    required: true
  }
}

const v$ = useVuelidate(rules, form);

async function save() {
  try {
    const response = await feedbackStore.addFeedBack(form.value); // Access email as form.email.value

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
