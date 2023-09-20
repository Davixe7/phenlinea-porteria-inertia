<template>
  <div class="q-pa-md">
    <q-table
    :rows="visits"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20, 30]"
    :pagination="true"
  >
    <template v-slot:top-right>
      <q-input
        v-model="search"
        filled
        dense
        placeholder="Buscar"
        class="q-mb-md"
      />
    </template>

    <template v-slot:body-cell-picture="props">
      <q-td :props="props">
        <q-avatar @click="()=>{dialogPicture = props.row.picture; dialog = true}">
          <img v-if="props.row.picture" :src="props.row.picture">
        </q-avatar>
      </q-td>
    </template>

    <template v-slot:body-cell-qr="props">
      <q-td :props="props">
        <q-avatar @click="()=>{dialogPicture = props.row.qrcode; dialog = true}" color="white">
          <img v-if="props.row.qrcode" :src="props.row.picture">
        </q-avatar>
      </q-td>
    </template>

    <template v-slot:body-cell-plate="props">
      <q-td :props="props">
        <q-badge :label="props.row.plate"></q-badge>
      </q-td>
    </template>

    <template v-slot:body-cell-checkout="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          :loading="checkouts.includes(props.row.id)"
          v-if="!props.row.checkout"
          icon="done_all"
          @click="attemptCheckout(visits.indexOf(props.row))">
        </q-btn>
        {{ props.row.checkout }}
      </q-td>
    </template>
  </q-table>
  </div>

  <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-img :src="dialogPicture"></q-img>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const _props = defineProps(['visits'])

const emit      = defineEmits('updateVisit')
const checkouts = ref([])
const dialogPicture  = ref(null)
const dialog  = ref(false)
const search  = ref('')
const columns = [
  { name: "picture",  label: "Foto",   align: "left", sortable: false },
  { name: "password", label: "PWD",    align: "left", field: 'password',    sortable: false },
  { name: "qr",       label: "QR",     align: "left", field: 'qrcode',      sortable: false },
  { name: "name",     label: "Nombre", align: "left", field: 'name' ,       sortable: false },
  { name: "dni",      label: "Cédula", align: "left", field: 'dni' ,        sortable: false },
  { name: "plate",    label: "Placa",  align: "left", field: 'plate' ,      sortable: false },
  { name: "checkin",  label: "Checkin", align: "left", field: 'checkin' ,   sortable: true },
  { name: "checkout", label: "Checkout", align: "left", field: 'checkout' , sortable: true },
]

function attemptCheckout(index){
  checkouts.value.push(_props.visits[index].id)
  api.post(`visits/${_props.visits[index].id}`, {_method: 'PUT'})
  .then(response => {
    checkouts.value.splice(checkouts.value.indexOf(_props.visits[index].id), 1)
    emit('updateVisit', {index, visit: response.data.data})
  })
}
</script>
