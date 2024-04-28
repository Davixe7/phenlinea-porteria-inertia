<template>
  <div id="novelty-form">

    <Camera
      v-if="camera"
      @cameraClosed="camera = false"
      @pictureTaken="getCameraPicture">
    </Camera>

    <q-card style="min-width: 360px;">
      <q-card-section>
        <span class="text-h6">Registrar novedad</span>
      </q-card-section>

      <q-card-section class="text-center q-pt-none q-gutter-y-md">
        <q-input outlined v-model="novelty.title" stack-label label="Título"></q-input>
        <q-input outlined type="textarea" v-model="novelty.description" stack-label label="Descripción"></q-input>
        <div class="row">
          <q-btn color="primary" icon="sym_o_camera" @click="camera=true"></q-btn>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Notificar" color="primary" @click="storeNovelty"/>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { ref, onMounted } from 'vue'
import Camera from './Camera.vue';

const props        = defineProps(['novelty'])
const novelty      = ref({ title: '', description: '' })
const pictureBlobs = ref([])
const camera       = ref(false)

function getCameraPicture(blob){
  pictureBlobs.value.push(blob)
  camera.value = false
}

function storeNovelty(){
  let data = new FormData()
  data.append('title', novelty.value.title)
  data.append('description', novelty.value.description)
  pictureBlobs.value.forEach((blob, i) => data.append(`pictures[${i}]`, blob))

  api.post('novelties', data)
  .then(response => console.log(response.data))
  .catch(error => console.log(error.response))
}

onMounted(() => {
  if (!props.novelty) return
  novelty.value = { ...props.novelty }
})
</script>
