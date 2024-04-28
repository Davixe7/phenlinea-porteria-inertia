<template>
  <div id="visit-form">

    <Camera
      v-if="camera"
      @pictureTaken="getCameraPicture"
      @cameraClosed="camera = false">
    </Camera>

    <q-card flat bordered>

      <q-card-section>
        <div class="text-h5 text-bold q-px-none">
          Registrar visita
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row align-center justify-center">
          <div v-if="visitor.picture" class="col">
            <q-img
              :src="visitor.picture"
              spinner-color="white"
              style="height: 140px; max-width: 150px"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          outlined
          stack-label
          type="text"
          class="q-mb-md"
          label="Apartamento"
          v-model="extension_name">
        </q-input>

        <div class="row q-col-gutter-x-md items-center">
          <div class="col">
            <q-input
              required
              outlined
              stack-label
              type="text"
              v-model="visitor.dni"
              label="Cédula"
              class="q-mb-md"
              @blur="fetchVisitor"
              ref="InputDni"
            />
          </div>
          <div class="col">
            <q-input
              required
              outlined
              stack-label
              type="text"
              label="Nombre"
              v-model="visitor.name"
              class="q-mb-md"
              ref="InputName"
            />
          </div>
        </div>

        <div class="row q-col-gutter-x-md">
          <div class="col">
            <q-input
              outlined
              stack-label
              type="text"
              v-model="visitor.phone"
              label="Celular"
              class="q-mb-md"
              ref="InputPhone"
            />
          </div>
          <div class="col">
            <q-input
              outlined
              stack-label
              type="text"
              label="Placa (opcional)"
              class="q-mb-md"
              v-model="visitor.plate"
            />
          </div>
        </div>

        <div class="q-mb-md">
          <q-radio dense v-model="visitor.type" val="singular" label="Personal" class="q-mr-md"/>
          <q-radio dense v-model="visitor.type" val="company" label="Empresa" />
        </div>

        <div class="row" v-if="visitor.type == 'company'">
          <div class="col q-pr-md">
            <q-input
              required
              outlined
              type="text"
              v-model="visitor.company"
              label="Nombre de la Empresa"
              class="q-mb-md"
              ref="InputCompany"
            />
          </div>

          <div class="col q-pr-md">
            <q-input
              outlined
              type="text"
              label="ARL"
              class="q-mb-md"
              v-model="visitor.arl"
            />
          </div>

          <div class="col">
            <q-input
              outlined
              type="text"
              label="EPS"
              class="q-mb-md"
              v-model="visitor.eps"
            />
          </div>
        </div>

        <div class="row q-gutter-x-md">
          <q-btn
            primary
            @click="camera = true"
            :loading="loading"
            icon="camera"
            color="primary"
            :label="'Tomar foto'">
          </q-btn>

          <q-btn
            dark
            @click="storeVisit"
            :loading="loading"
            class="bg-black text-white q-ml-auto">
            Guardar
          </q-btn>
        </div>

        <q-file v-if="false" outlined v-model="picture" ref="FileInput" label="Foto del visitante" class="q-mb-md">
          <template v-slot:prepend>
            <q-icon name="camera_alt" />
          </template>
        </q-file>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Camera from './../../components/Camera.vue'
import { api } from 'src/boot/axios';

const emit            = defineEmits('dataSent')
const loading         = ref(false)
const camera          = ref(false)
const pictureURL      = ref(false)
const extension_name  = ref(null)
const visitor         = ref({
  dni: '',
  name: '',
  phone: '',
  plate: '',
  type: 'singular',
  company: '',
  arl: '',
  eps: '',
})

function fetchVisitor(){
  api.get('visitors',
  {params: {dni: visitor.value.dni}})
  .then(response => visitor.value = {...response.data.data})
}

function getCameraPicture(pictureBlob) {
  camera.value     = false
  pictureURL.value = pictureBlob
}

function storeVisit() {
  if( !extension_name.value ) return
  loading.value = true
  emit('dataSent', loadData())
}

function loadData() {
  let data = new FormData()
  Object.keys(visitor.value)
  .forEach(key => data.append(key, visitor.value[key] ? visitor.value[key] : ''))

  if( visitor.value.id ){
    data.append('visitor_id', visitor.value.id)
  }

  data.append('picture', pictureURL.value)
  data.append('extension_name', extension_name.value)
  return data
}
</script>
