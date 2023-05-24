<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="text-grey-9" style="background-color: #636466">
      <q-toolbar class="fit row wrap justify-between items-start content-start">
        <div class="row">
          <q-btn
            dense
            flat
            round
            style="color: #ee7600"
            icon="menu"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title
            class="text-h4 row"
            style="font-family: 'Bebas Neue'; color: #ee7600"
          >
            <div class="q-mr-md">RECLAMOS APP</div>
            <q-separator vertical inset />
            <div v-if="!($q.screen.lt.md || $q.screen.lt.sm)" class="q-ml-md">
              DISTRIUBUDORA PALACIOS SOTO & CIA
            </div>
          </q-toolbar-title>
        </div>

        <div class="row items-center content-center q-mr-md">
          <q-btn flat style="color: #ee7600" @click="cerrarSesion">
            <div class="q-mr-sm" v-if="!($q.screen.lt.md || $q.screen.lt.sm)">
              Salir
            </div>
            <q-icon left name="logout" />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item class="column">
            <q-separator inset />
            <div style="color: #636466" class="text-center">Bienvenido</div>
            <div class="text-weight-bold text-center" style="color: #636466">
              {{ appStore.usuario.nombre_comercial }}
            </div>
            <q-separator inset />
          </q-item>
          <q-item
            clickable
            v-ripple
            to="/editar_reclamo"
            @click="reset()"
            active-class="my-menu-link"
            exact
          >
            <q-item-section avatar>
              <q-icon name="description" color="grey-8" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-secondary text-h6"
                style="font-family: 'Bebas Neue'"
              >
                INGRESAR RECLAMO
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin_usuario"
            @click="reset()"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="inbox" color="grey-8" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-secondary text-h6"
                style="font-family: 'Bebas Neue'"
              >
                REVISAR RECLAMO
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin_bodega"
            @click="reset()"
            v-show="appStore.appCodigo !== appStore.APP_CLIENTE"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="inventory" color="grey-8" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-secondary text-h6"
                style="font-family: 'Bebas Neue'"
              >
                BODEGA
              </span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img
        fit="fill"
        class="absolute-top q-pa-sm"
        src="../assets/logo_apromed.png"
        style="height: 150px"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { LocalStorage } from 'quasar';
import { ref } from 'vue';
import { useAppStore } from '../stores/useAppStore';
import { useQuasar } from 'quasar';

// Data
const $q = useQuasar();
$q.screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 });
const appStore = useAppStore();
const win: Window = window;

// Methods
const cerrarSesion = () => {
  win.location = 'https://www.loxasoluciones.com/';
  LocalStorage.clear();
};

const reset = () => {
  appStore.ruc = '';
  appStore.desde = null;
  appStore.hasta = null;
  appStore.factura = '';
};

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style lang="scss">
.my-menu-link {
  color: white;
  background: #ee7600;
}
</style>
