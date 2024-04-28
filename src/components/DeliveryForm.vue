<template>
  <q-card v-if="apartment">
    <q-card-section class="column justify-center items-center">
      <q-avatar :icon="success ? 'sym_o_done_all' : 'sym_o_package_2'" color="primary" text-color="white" />
    </q-card-section>

    <template v-if="success">
      <q-card-section class="text-center q-pt-none">
        <div class="text-h6 q-mb-sm">{{ apartment.name }}</div>
        Notificación enviada exitosamente
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Listo" color="primary" v-close-popup />
      </q-card-actions>
    </template>

    <template v-else-if="(apartment.id || apartmentName)">
      <q-card-section class="text-center q-pt-none">
        <div class="text-h6 q-mb-sm">{{ apartment.name ? apartment.name : apartmentName}}</div>
        ¿Desea notificar encomienda al apartamento?
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Notificar" color="primary" :loading="loading" @click="sendNotification"/>
      </q-card-actions>
    </template>

    <template v-else>
      <q-card-section class="text-center q-pt-none">
        <div class="text-h6 q-mb-sm">Seleccionar apartamento</div>
        <q-select
          outlined
          use-input
          emit-value
          map-options
          :options="options"
          option-label="name"
          option-value="name"
          @filter="filterFn"
          v-model="apartmentName">
        </q-select>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Notificar" color="primary" :disabled="!apartmentName" v-close-popup />
      </q-card-actions>
    </template>

  </q-card>
</template>

<script setup>
import { api } from 'src/boot/axios';
import {onMounted, ref, watch} from 'vue'

const loading     = ref(false)
const success     = ref(false)
const apartmentName = ref()
const options     = ref([])
const apartments  = ref([])
const props       = defineProps(['apartment'])
const apartment   = ref({})

watch(()=>props.apartment, (newApartment, oldApartment)=>{
  apartment.value = {...newApartment}
})

function filterFn(val, update){
  if(val === ''){
    update(() => options.value = [...apartments.value])
    return
  }
  update(()=>{
    let needle = val.toLowerCase()
    options.value = apartments.value.filter(apt => apt.name.toLowerCase().includes(needle))
  })
}

function fetchApartments(){
  api.get('apartments')
  .then(response => {
    apartments.value = response.data.data.map(needle => ({name: needle.name, id: needle.id}))
    options.value = [...apartments.value]
  })
  .catch(error => console.log(error))
}

function sendNotification(){
  loading.value = true
  let id = apartment.value.name ? apartment.value.name : apartmentName.value
  api.post(`extensions/${id}/delivery`)
  .then(response => {
    success.value = true
  })
  .catch(error => console.log(error))
  .finally(()=>loading.value = false)
}

onMounted(()=>{
  if( !props.apartment ){
    fetchApartments()
    return
  }
  apartment.value = {...props.apartment}
})
</script>
