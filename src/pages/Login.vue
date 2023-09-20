<template>
  <q-card flat style="max-width: 420px; margin: 50px auto;">
    <q-card-section>
      <div class="text-h6">
        Control de porterias
      </div>
    </q-card-section>
    <q-card-section>
      <form @submit.prevent="attemptLogin" class="q-gutter-y-md">
        <q-input outlined type="email" stack-label v-model="email" label="Email"></q-input>
        <q-input outlined type="password" stack-label v-model="password" label="Contraseña"></q-input>
        <div class="flex justify-end">
          <q-btn type="submit" color="primary" :loading="loading">
            Enviar
          </q-btn>
        </div>
      </form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { localstorage } from 'src/boot/localStorage'
import { useRouter } from 'vue-router';

const router = useRouter()
const email    = ref('')
const password = ref('')
const loading  = ref(false)

function attemptLogin(){
  let data = {
    email: email.value,
    password: password.value
  }

  loading.value = true

  api.post('porteria-login', data)
  .then(response => {
    if( !response.data.user.api_token ) return
    localstorage.set('api_token', response.data.user.api_token)
    router.push('home')
  })
  .catch(error => {
    if( error.response.status == 401 ){
      alert('Nombre de usuario o contraseña incorrectos')
      email.value = ''
      password.value = ''
    }
  })
  .finally(()=>loading.value = false)
}
</script>
