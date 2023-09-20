<template>
  <VisitsTable
    :visits="visits"
    @updateVisit="updateVisit">
  </VisitsTable>

  <q-dialog v-model="dialog">
    <VisitsForm
      :errors="errors"
      @dataSent="storeVisit">
    </VisitsForm>
  </q-dialog>

  <q-page-sticky position="bottom-right" :offset="[18, 36]">
    <q-btn fab icon="add" color="primary" @click="dialog=true"/>
  </q-page-sticky>
</template>

<script setup>
  import VisitsTable from './VisitsTable.vue';
  import VisitsForm from './VisitsForm.vue';
  import { onMounted, ref } from 'vue';
  import { api } from 'src/boot/axios';

  const dialog = ref(false)
  const visits = ref([])
  const errors = ref(null)

  function storeVisit(data){
    api.post('visits', data)
    .then(response => {visits.value.unshift(response.data.data); dialog.value = false})
    .catch(error   => {
      if( error.response.status == 422 ){
        errors.value = error.response.data.errors
      }
    })
  }

  function updateVisit(data){
    visits.value.splice(data.index, 1, data.visit)
  }

  onMounted(() => api.get('visits').then(response => visits.value = response.data.data))
</script>
