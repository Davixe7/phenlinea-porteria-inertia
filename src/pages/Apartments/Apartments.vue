<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :filter="search">
    <template v-slot:top="props">
      <q-input dense filled v-model="search" label="Buscar" style="width: 100%;"></q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td class="q-gutter-x-sm flex justify-end items-center" style="padding-top: .2rem;">
        <q-btn color="primary" flat round icon="sym_o_package_2" @click="attemptNotifyDelivery(props.row)"></q-btn>
        <q-btn color="primary" flat round icon="sym_o_supervisor_account" @click="()=>{residents = props.row.residents; residentsDialog = true;}"></q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-plates="props">
      <q-td class="q-gutter-x-sm">
        <q-badge v-if="!props.row.plates.length" color="grey">ninguna</q-badge>
        <q-badge v-else color="primary" v-for="plate in props.row.plates">{{ plate }}</q-badge>
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="residentsDialog">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Residentes</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-table flat :rows="residents" :columns="residentColumns" :hide-pagination="true"></q-table>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="deliveryDialog">
    <delivery-form :apartment="apartment"></delivery-form>
  </q-dialog>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { ref, onMounted } from 'vue';
import DeliveryForm from 'components/DeliveryForm.vue'

const apartment       = ref({})
const deliveryDialog  = ref(false)
const residentsDialog = ref(false)
const residents       = ref([])
const residentColumns = [
  {label: 'Nombre',      field: 'name',        name: 'name',        align: 'left'},
  {label: 'Edad',        field: 'age',         name: 'age',         align: 'left'},
  {label: 'Propietario', field: row => row.is_owner ? 'Sí' : 'No',    name: 'is_owner',    align: 'left'},
  {label: 'Residente',   field: row => row.is_resident ? 'Sí' : 'No', name: 'is_resident', align: 'left'},
]

const search  = ref('')
const rows    = ref([])
const columns = [
  {name: 'name', label: 'Nro.',                 field: 'name', sortable: true, align: 'left'},
  {name: 'pets_count', label: 'Cant. Mascotas', field: 'pets_count', sortable: true, align: 'left'},
  {name: 'parking_numbers', label: 'Parqueaderos', field: 'parking_numbers_str', sortable: false, align: 'left'},
  {name: 'plates', label: 'Placas', field: 'plates', sortable: true, align: 'left'},
  {name: 'actions', sortable: true, align: 'right'},
]

onMounted(() => {
  api.get('apartments').then(response => rows.value = [...response.data.data])
})

function attemptNotifyDelivery(extension){
  apartment.value      = extension
  deliveryDialog.value = true
}

function notifyDelivery(extension){
  axios.post(`/extensions/${extension.id}/notifyDelivery`)
  .then(response => {
    deliveryDialog.value = false
  })
  .catch(error => console.log(error))
}
</script>

