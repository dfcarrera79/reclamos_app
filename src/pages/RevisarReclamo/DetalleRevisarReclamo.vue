<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="alert">
      <q-card square>
        <q-card-section>
          <div
            class="text-left text-h6 text-grey-8"
            style="font-family: 'Bebas Neue'"
          >
            <strong>ARCHIVOS:</strong>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="fotos.length >= 1">
            <div v-for="(foto, index) in fotos" :key="index">
              <img
                class="q-ma-sm"
                :src="
                  foto.path.replace(
                    'C:\\Users\\dfcar\\Dropbox\\Developer\\Projects\\Reclamos\\fastapi_reclamos\\public\\imagenes_reclamos\\',
                    'http://localhost:8000/static/'
                  )
                "
                style="max-height: 500px; max-width: 500px"
              />
              <q-separator inset />
            </div>
          </div>
          <div v-else>Ningún archivo adjunto</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cerrar"
            color="primary"
            @click="
              alert = false;
              fotos = [];
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <div>
    <q-table
      v-if="filas.length > 0"
      class="text-h6 text-grey-8 justify-center"
      square
      flat
      bordered
      no-data-label="Datos no disponibles"
      hide-no-data
      :rows="props.filas"
      :columns="columnas"
      row-key="name"
      :visible-columns="visibleColumns"
      v-model:pagination="pagination"
      hide-pagination
    >
      <template v-slot:top-left>
        <p class="text-primary text-h5" style="font-family: 'Bebas Neue'">
          RECLAMOS
        </p>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            style="text-align: center"
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td
            style="text-align: center"
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <template v-if="col.name === 'estado'">
              <template v-if="col.value === 'Finalizado'">
                <q-badge rounded color="positive"> {{ col.value }} </q-badge>
              </template>
              <template v-else-if="col.value === 'Pendiente'">
                <q-badge rounded color="negative"> {{ col.value }} </q-badge>
              </template>
              <template v-else>
                <q-badge rounded color="orange"> {{ col.value }} </q-badge>
              </template>
            </template>
            <template v-else>
              {{ col.value }}
            </template>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left" v-show="props.row.estado !== 'Pendiente'">
              <strong>Encargado del reclamo:</strong>
              {{ props.row.nombre_usuario }}
            </div>
            <div class="text-left" v-show="props.row.estado !== 'Pendiente'">
              <strong>Respuesta al reclamo:</strong>
              {{ props.row.respuesta_finalizado }}
            </div>
            <div class="row wrap">
              <div
                class="q-ma-sm"
                v-for="reclamo in props.row.reclamos"
                :key="reclamo.producto.id"
              >
                <q-card bordered square flat class="my-card">
                  <q-card-section>
                    <p class="text-h7 wrap">{{ reclamo.producto.nombre }}</p>
                  </q-card-section>

                  <q-separator inset />

                  <q-card-section>
                    <p class="text-left" style="width: 310px">
                      <strong>Motivo:</strong>
                      {{ reclamo.motivo.nombre_motivo }}
                    </p>
                    <p class="text-left" style="width: 310px">
                      <strong>Detalle: </strong>
                      <span v-html="reclamo.comentario"></span>
                    </p>
                    <p
                      class="text-left"
                      style="width: 310px"
                      v-if="reclamo.archivos.every((item: number) => item === 0)"
                    >
                      <strong>Archivos:</strong> Ningún archivo adjunto
                    </p>
                    <q-btn
                      v-if="!reclamo.archivos.every((item: number) => item === 0)"
                      size="11px"
                      outline
                      color="primary"
                      square
                      @click="mostrarArchivos(reclamo.archivos)"
                      >Archivos</q-btn
                    >
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="row justify-center q-mt-md">
      <q-pagination
        v-if="pagesNumber > 1"
        size="12px"
        v-model="pagination.page"
        :max="pagesNumber"
        direction-links
        boundary-links
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
        text-color="grey"
        color="primary"
        unelevated
        flat
        active-design="flat"
        active-color="white"
        active-text-color="primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAxios } from '../../services/useAxios';
import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
import { Archivo, RespuestaArchivo, FilasReclamos } from 'components/models';

// Data
const { get } = useAxios();
const alert = ref(false);
const fotos = ref<Archivo[]>([]);
const props = defineProps<{
  filas: FilasReclamos[];
}>();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
});

const visibleColumns = [
  'estado',
  'numero',
  'fecha',
  'ruc',
  'cliente',
  'factura',
];

const columnas: QTableProps['columns'] = [
  {
    name: 'estado',
    label: 'Estado',
    align: 'left',
    field: 'estado',
    sortable: true,
  },
  {
    name: 'numero',
    label: 'Nro. reclamo',
    align: 'left',
    field: 'nro_reclamo',
    sortable: true,
  },
  {
    name: 'fecha',
    align: 'left',
    label: 'Fecha del reclamo',
    field: 'fecha_reclamo',
    sortable: true,
  },
  {
    name: 'cliente',
    align: 'left',
    label: 'Cliente',
    field: 'cliente',
    sortable: true,
  },
  { name: 'ruc', align: 'left', label: 'RUC', field: 'ruc' },
  {
    name: 'factura',
    label: 'Nro. factura',
    field: 'nro_factura',
    align: 'left',
  },
  { name: 'detalle', label: 'Detalle', field: 'comentario', align: 'left' },
  { name: 'motivo', label: 'Motivo', field: 'motivo', align: 'left' },
  {
    name: 'encargado',
    label: 'Encagado del reclamo',
    field: 'nombre_usuario',
    align: 'left',
  },
  {
    name: 'fecha_enproceso',
    label: 'Fecha del estado',
    field: 'fecha_enproceso',
    align: 'left',
  },
  {
    name: 'fecha_finalizado',
    label: 'Fecha finalizado',
    field: 'fecha_finalizado',
    align: 'left',
  },
];

// Methods
const mostrarArchivos = async (archivos: [number, number, number]) => {
  for (const archivo of archivos) {
    if (archivo != 0) {
      const newQuery = `/obtener_archivos/${archivo}`;
      const respuesta: RespuestaArchivo = await get(newQuery, {});
      if (respuesta.error === 'S') {
        // mostrarMensaje('Error', respuesta.mensaje);
        console.error(respuesta.mensaje);
        return;
      }
      fotos.value.push(respuesta.objetos[0]);
    }
  }
  alert.value = true;
};

// Computed
const pagesNumber = computed(() => {
  return Math.ceil(props.filas.length / pagination.value.rowsPerPage);
});
</script>
