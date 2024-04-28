<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Control de Porterias
        </q-toolbar-title>

        <div>
          <q-btn icon="logout" flat round @click="attemptLogout"></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="true"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-item
          clickable
          @click="noveltyDialog=true"
        >
          <q-item-section avatar>
            <q-icon name="support_agent"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Novedades</q-item-label>
            <q-item-label caption>Registrar una novedad</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="deliveryDialog=true">
          <q-item-section avatar>
            <q-icon name="sym_o_package_2"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Encomienda</q-item-label>
            <q-item-label caption>Notificar una encomienda</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md">
        <router-view/>

        <q-dialog v-model="noveltyDialog">
          <novelty-form></novelty-form>
        </q-dialog>

        <q-dialog v-model="deliveryDialog">
          <delivery-form></delivery-form>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { localstorage } from 'src/boot/localStorage'
import { useRouter } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue'

import NoveltyForm from 'components/NoveltyForm.vue'
import DeliveryForm from 'components/DeliveryForm.vue'

const noveltyDialog  = ref(false)
const deliveryDialog = ref(false)

const linksList = [
  {
    title: 'Apartamentos',
    caption: 'Apartamentos',
    icon: 'meeting_room',
    link: '/#/apartamentos'
  },
  {
    title: 'Visitas',
    caption: 'Visitas',
    icon: 'sym_o_location_away',
    link: '/#/visitas'
  }
]

const router = useRouter()
const leftDrawerOpen = ref(false)
const essentialLinks = linksList

function attemptLogout(){
  localstorage.remove('api_token')
  router.push('login')
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
