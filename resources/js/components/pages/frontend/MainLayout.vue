<template>
    <div>
        <div class="container mt-2">
            <div class="row bg-dark">
                <div class="col-md-9">
                    <nav class="navbar navbar-expand-sm p-3">
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-list-4"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbar-list-4">
                            <ul class="navbar-nav">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"
                                            width="40" height="40" class="rounded-circle" />
                                        <span class="text-white">User</span>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <a class="dropdown-item" href="#">Dashboard</a>
                                        <a class="dropdown-item" href="#">Edit Profile</a>
                                        <a class="dropdown-item" href="#">Log Out</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div class="col-md-3 d-flex align-items-center">
                    <h4 class="text-white">Feed Board</h4>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12 float-right">
                    <router-link  to="/add/feedback"><button class="btn btn-action btn-2xs btn-outline btn-primary m-1 float-right">
                        <i class="iconoir-edit"></i>
                        <span class="ml-1">Add Feedback</span>
                    </button></router-link>
                </div>
            </div>
            <div class="relative min-h-screen">
                <div class="sticky top-0 z-10 pb-3 bg-gray-200 dark:bg-gray-800">
                    <div class="flex flex-row px-2 lg:px-0 items-center justify-between w-full mt-2 mb-1 lg:mt-3 lg:mb-2">
                        <div class="flex text-2xl leading-tight dark:text-white"></div>
                        <div class="flex justify-end"></div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <div class="relative min-h-screen">
                        <div class="overflow-x-auto">
                            <div v-if="feedbackData != '' " class="card">

                                <div v-for="(feedback, index) in feedbackData" :key="index" class="card">
                                        <div class="card-body">
                                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div class="flex flex-col space-y-3">
                                                    <h4 class="text-lg font-bold">
                                                        {{ feedback.title }}
                                                    </h4>
                                                    <p class="">
                                                        <b>{{ feedback.description }}</b>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-4 md:text-right">
                                            <div class="actions">
                                                <button class="btn btn-action btn-2xs btn-outline btn-primary m-1" @click="upvote(feedback.id)">
                                                    <i class="iconoir-edit"></i>
                                                    <span class="ml-1">UpVote</span>
                                                </button>
                                                <button class="btn btn-action btn-2xs btn-outline btn-primary m-1" @click="downvote(feedback.id)">
                                                    <i class="iconoir-edit"></i>
                                                    <span class="ml-1">DownVote</span>
                                                </button>
                                                <button class="btn btn-action btn-2xs btn-outline btn-primary m-1" @click="comment(feedback.id)">
                                                    <i class="iconoir-edit"></i>
                                                    <span class="ml-1">Comment</span>
                                                </button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div v-else class="card bg-gray-100 dark:bg-gray-800  mb-2 ">
                                <div class="card-body text-center">
                                    <h4 class="text-lg text-gray-500">Data not found</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
const feedbackData = ref({});
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

feedBackList();
async function feedBackList() {

    let response = await feedbackStore.feedBackListPaginated();
    if (response) {
        if(response.status == 401){
            console.log("Check Test")
            authStore.flushUser()
            router.push({ name: 'admin.login' });
            return false;
        }
        if (!response.success) {
            if (response.errors) {
                for (let key in response.errors) {
                    let error = response.errors[key];
                    v$.value[key].$serverError = error
                }
            }
            else if (response.message) {
                toast.add({severity:'error', summary: t('Success'), detail: t('Something went wrong!'), life: 3000});
            }
        }else{
            feedbackData.value = response.data.feedback
        }

    }

};
async function upvote(id) {

    let response = await feedbackStore.addUpVote(id);
    if (response) {
        if(response.status == 401){
            console.log("Check Test")
            authStore.flushUser()
            router.push({ name: 'admin.login' });
            return false;
        }
        if (!response.success) {
            if (response.errors) {
                for (let key in response.errors) {
                    let error = response.errors[key];
                    v$.value[key].$serverError = error
                }
            }
            else if (response.message) {
                toast.add({severity:'error', summary: t('Success'), detail: t('Something went wrong!'), life: 3000});
            }
        }else{
            console.log('success....');
        }

    }

};
</script>

<style scoped>
</style>
