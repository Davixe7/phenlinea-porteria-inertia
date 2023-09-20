<template>
  <div id="home">
    <div class="row q-col-gutter-md">
      <div class="col text-center">
        <q-card bordered flat @click="$router.push('visitas')">
          <q-card-section>
            Visitas
          </q-card-section>
        </q-card>
      </div>

      <div class="col text-center">
        <q-card bordered flat>
          <q-card-section>
            Apartamentos
          </q-card-section>
        </q-card>
      </div>

      <div class="col text-center">
        <q-card bordered flat>
          <q-card-section>
            Novedades
          </q-card-section>
        </q-card>
      </div>

      <div class="col text-center">
        <q-card bordered flat>
          <q-card-section>
            Placas
          </q-card-section>
        </q-card>
      </div>

      <div class="col text-center">
        <q-card bordered flat>
          <q-card-section>
            Notificar encomienda
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

  const extensions = ref([])
  onMounted(() => api.get('extensions').then(response=>extensions.value = response.data.data))
</script>
