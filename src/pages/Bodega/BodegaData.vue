<template>
  <div>
    <h4 class="text-grey-8" style="font-family: 'Bebas Neue'">
      BANDEJA DE RECLAMOS
    </h4>

    <div
      class="row q-col-gutter-md"
      style="max-width: 800px"
      v-if="!($q.screen.lt.md || $q.screen.lt.sm)"
    >
      <div class="q-pa-md q-gutter-md" style="max-width: 210px">
        <p class="col-6 text-grey-8"><strong> Ruc del cliente:</strong></p>
        <q-input
          v-model="appStore.ruc"
          square
          type="text"
          label="RUC"
          debounce="350"
          :disable="appStore.appCodigo === appStore.APP_CLIENTE"
          outlined
          dense
          options-dense
          clearable
          clear-icon="close"
        />
      </div>

      <div class="q-pa-md q-gutter-md" style="max-width: 210px">
        <p class="col-6 text-grey-8"><strong> Factura:</strong></p>
        <q-input
          label="Ej: 001-001-010001"
          v-model="appStore.factura"
          square
          debounce="350"
          placeholder="001-001-010001"
          :rules="[
            (val) =>
              formatoFactura.test(val) ||
              'Por favor ingrese el nro. de factura en el formato correcto',
          ]"
          lazy-rules
          outlined
          clearable
          clear-icon="close"
          dense
          options-dense
        />
      </div>

      <div class="q-pa-md" style="max-width: 200px">
        <p class="col-6 text-grey-8"><strong>Fecha desde:</strong></p>
        <q-input
          square
          debounce="350"
          v-model="appStore.desde"
          mask="date"
          :rules="['date']"
          outlined
          dense
          options-dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="appStore.desde">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="q-pa-md" style="max-width: 200px">
        <p class="col-6 text-grey-8"><strong>Fecha hasta:</strong></p>

        <q-input
          square
          debounce="350"
          v-model="appStore.hasta"
          mask="date"
          :rules="['date']"
          outlined
          dense
          options-dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="appStore.hasta">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../../stores/useAppStore';

// Datos
const appStore = useAppStore();
const formatoFactura = /([0-9]{3}-[0-9]{3}-[0-9]{6})/;
const ruc = ref(appStore.ruc);
ruc.value = ref(
  appStore.appCodigo === appStore.APP_CLIENTE
    ? appStore.usuario.ruc_cliente
    : ''
);
</script>
