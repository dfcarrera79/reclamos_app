<template>
  <div>
    <h4 class="text-grey-8" style="font-family: 'Bebas Neue'">
      REVISAR RECLAMOS
    </h4>
    <div class="row q-col-gutter-md" style="max-width: 800px">
      <div class="q-pa-md">
        <p class="col-6 text-grey-8"><strong>Ruc del cliente:</strong></p>
        <q-input
          square
          debounce="350"
          v-model="appStore.ruc"
          type="text"
          label="RUC"
          :disable="appStore.appCodigo === appStore.APP_CLIENTE"
          outlined
          dense
          clearable
          clear-icon="close"
          options-dense
          style="max-width: 210px"
        />
      </div>

      <div class="q-pa-md" style="max-width: 210px">
        <p class="col-6 text-grey-8"><strong>Fecha desde:</strong></p>
        <q-input
          square
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
const ruc = ref(appStore.ruc);
ruc.value = ref(
  appStore.appCodigo === appStore.APP_CLIENTE
    ? appStore.usuario.ruc_cliente
    : ''
);
</script>
