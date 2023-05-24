<template>
  <q-page padding>
    <BodegaData v-if="!($q.screen.lt.md || $q.screen.lt.sm)" />
    <BodegaDataMovil v-if="$q.screen.lt.md" />

    <q-splitter
      v-if="!($q.screen.lt.md || $q.screen.lt.sm)"
      v-model="splitter"
      class="full-width"
      style="height: 600px"
    >
      <template v-slot:before>
        <q-tabs
          v-model="estado"
          vertical
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          outlined
        >
          <q-tab name="PEN" icon="pending" label="Pendientes" />
          <q-tab name="PRO" icon="timelapse" label="En proceso" />
          <q-tab name="FIN" icon="check_circle" label="Finalizados" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="estado"
          animated
          swipeable
          transition-prev="jump-up"
          transition-next="jump-up"
          outlined
        >
          <q-tab-panel name="PEN" @click="whichQuery()">
            <DetalleReclamoBodega :estado="estado" :filas="filas" />
          </q-tab-panel>
          <q-tab-panel name="PRO" @click="whichQuery()">
            <DetalleReclamoBodega :estado="estado" :filas="filas" />
          </q-tab-panel>
          <q-tab-panel name="FIN" @click="whichQuery()">
            <DetalleReclamoBodega :estado="estado" :filas="filas" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <q-splitter
      v-if="$q.screen.lt.md"
      v-model="splitterModel"
      horizontal
      style="height: 400px"
    >
      <template v-slot:before>
        <q-tabs
          v-model="estado"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          outlined
        >
          <q-tab name="PEN" icon="pending" label="Pendientes" />
          <q-tab name="PRO" icon="timelapse" label="En proceso" />
          <q-tab name="FIN" icon="check_circle" label="Finalizados" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="estado"
          animated
          swipeable
          transition-prev="jump-up"
          transition-next="jump-up"
          outlined
          class="q-ma-none q-pa-xs"
        >
          <q-tab-panel
            name="PEN"
            @click="whichQuery()"
            class="q-ma-none q-pa-xs"
          >
            <DetalleReclamoBodegaMovil :estado="estado" :filas="filas" />
          </q-tab-panel>
          <q-tab-panel
            name="PRO"
            @click="whichQuery()"
            class="q-ma-none q-pa-xs"
          >
            <DetalleReclamoBodegaMovil :estado="estado" :filas="filas" />
          </q-tab-panel>
          <q-tab-panel
            name="FIN"
            @click="whichQuery()"
            class="q-ma-none q-pa-xs"
          >
            <DetalleReclamoBodegaMovil :estado="estado" :filas="filas" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAxios } from '../../services/useAxios';
import { useAppStore } from '../../stores/useAppStore';
import { RespuestaBodega, Filas, Objetos } from 'components/models';
import BodegaData from './BodegaData.vue';
import BodegaDataMovil from './BodegaDataMovil.vue';
import DetalleReclamoBodega from './DetalleReclamoBodega.vue';
import DetalleReclamoBodegaMovil from './DetalleReclamoBodegaMovil.vue';
import moment from 'moment';

// Datos
const appStore = useAppStore();
const { get } = useAxios();
const estado = ref('');
const splitter = ref(10);
const reclamos = ref([]);
const filas = ref<Filas[]>([]);
const splitterModel = ref(20);

//  Métodos
const whichEstado = computed(() => {
  if (
    appStore.desde !== null &&
    appStore.hasta !== null &&
    estado.value !== '' &&
    appStore.ruc !== '' &&
    appStore.factura !== ''
  ) {
    return `/reclamos_por_estado/${estado.value}?ruc=${appStore.ruc}&desde=${appStore.desde}&hasta=${appStore.hasta}&factura=${appStore.factura}`;
  } else if (
    appStore.desde !== null &&
    appStore.hasta !== null &&
    estado.value !== '' &&
    appStore.ruc !== ''
  ) {
    return `/reclamos_por_estado/${estado.value}?ruc=${appStore.ruc}&desde=${appStore.desde}&hasta=${appStore.hasta}`;
  } else if (
    estado.value !== '' &&
    appStore.desde !== null &&
    appStore.hasta !== null &&
    appStore.factura !== ''
  ) {
    return `/reclamos_por_estado/${estado.value}?desde=${appStore.desde}&hasta=${appStore.hasta}&factura=${appStore.factura}`;
  } else if (
    estado.value !== '' &&
    appStore.desde !== null &&
    appStore.hasta !== null
  ) {
    return `/reclamos_por_estado/${estado.value}?desde=${appStore.desde}&hasta=${appStore.hasta}`;
  } else if (estado.value !== '' && appStore.ruc !== '') {
    return `/reclamos_por_estado/${estado.value}?ruc=${appStore.ruc}`;
  } else if (estado.value !== '' && appStore.factura !== '') {
    return `/reclamos_por_estado/${estado.value}?factura=${appStore.factura}`;
  } else if (estado.value !== '') {
    return `/reclamos_por_estado/${estado.value}`;
  } else {
    return '';
  }
});

const query = ref(whichEstado);

const whichQuery = async () => {
  const respuesta: RespuestaBodega = await get(query.value, {});
  const objetos: Objetos[] = respuesta.objetos;
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    // mostrarMensaje('Error', respuesta.mensaje);
    return '';
  }
  filas.value = [];
  reclamos.value = [];
  if (respuesta.error === 'N') {
    if (objetos.length >= 1) {
      for (const objeto of objetos) {
        filas.value.push({
          nro_reclamo: objeto.id_reclamo,
          fecha_reclamo: moment(objeto.fecha_reclamo).format('DD-MM-YYYY'),
          fecha_enproceso: moment(objeto.fecha_enproceso).format('DD-MM-YYYY'),
          fecha_finalizado: moment(objeto.fecha_finalizado).format(
            'DD-MM-YYYY'
          ),
          ruc: objeto.ruc_reclamante,
          cliente: objeto.nombre_reclamante,
          nro_factura: objeto.no_factura,
          nombre_usuario: objeto.nombre_usuario,
          respuesta_finalizado: objeto.respuesta_finalizado,
          reclamos: objeto.reclamos,
        });
      }
    } else {
      return '';
    }
  }
};

watch(query, () => whichQuery());
</script>
