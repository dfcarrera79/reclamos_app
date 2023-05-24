<template>
  <DialogoEstado :idReclamo="idReclamo" :seleccion="seleccion" />

  <div class="q-pa-xs q-ma-none">
    <q-dialog v-model="alert" maximized>
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
                style="max-height: 380px; max-width: 380px"
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

  <div class="q-pa-xs">
    <q-table
      grid
      flat
      square
      bordered
      hide-bottom
      class="text-grey-8 q-pa-xs"
      :rows="props.filas"
      :columns="columnas"
      row-key="nro_reclamo"
      v-model:pagination="pagination"
      hide-pagination
      :visible-columns="visibleColumns"
    >
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card bordered flat class="q-pa-xs">
            <q-card-section class="q-pa-xs">
              <q-select
                v-show="estado !== 'FIN'"
                outlined
                dense
                square
                options-dense
                v-model="seleccion"
                :options="estadosFiltrados"
                label="Cambiar estado"
                emit-value
                map-options
                style="max-width: 250px"
              >
                <template v-slot:option="{ itemProps, opt, toggleOption }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label> {{ opt.label }} </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        :model-value="appStore.select"
                        checked-icon="check"
                        @update:model-value="
                          toggleOption(opt),
                            opt.value === 'FIN' || opt.value === 'PRO'
                              ? (appStore.confirmarFinalizado = true)
                              : (appStore.confirmarFinalizado = false),
                            (idReclamo = props.key)
                        "
                      />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-card-section
                class="bg-grey-8 text-white row justify-center q-pa-none"
              >
                <strong>RECLAMO</strong>
              </q-card-section>

              <q-list dense>
                <q-item v-show="estado !== 'PEN'">
                  <q-item-section>Encargado del reclamo: </q-item-section>
                  <q-item-section>
                    {{ props.row.nombre_usuario }}
                  </q-item-section>
                </q-item>

                <q-item v-show="estado !== 'PEN'">
                  <q-item-section>Respuesta al reclamo: </q-item-section>
                  <q-item-section>
                    <span v-html="props.row.respuesta_finalizado"></span>
                  </q-item-section>
                </q-item>

                <q-item
                  v-for="col in props.cols.filter(
                    (col) => col.name !== 'desc' && col.name !== 'reclamos'
                  )"
                  :key="col.name"
                >
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section v-if="col.name === 'prioridad'">
                    <q-item-label v-if="col.value === 'Alta'">
                      <q-badge rounded color="negative">
                        {{ col.value }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label v-else-if="col.value === 'Media'">
                      <q-badge rounded color="warning">
                        {{ col.value }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label v-else>
                      <q-badge rounded color="grey-5">
                        {{ col.value }}
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-else>
                    <q-item-label caption> {{ col.value }} </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-section class="flex flex-center q-pa-xs">
              <strong>Productos en reclamo</strong>
              <div
                v-for="col in props.cols.filter(
                  (col) => col.name == 'reclamos'
                )"
                :key="col.name"
              >
                <div v-for="reclamo in col.value" :key="reclamo.producto.id">
                  <q-separator />
                  <p>
                    {{ reclamo.producto.nombre }}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {{ reclamo.motivo.nombre_motivo }}
                  </p>
                  <p>
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
                  <q-separator />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
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
import { useAppStore } from '../../stores/useAppStore';
import { computed, ref } from 'vue';
import { columnasVisibles } from '../../services/useColumnasVisibles.js';
import { Archivo, Filas, RespuestaArchivo } from 'components/models';
import DialogoEstado from './DialogoEstado.vue';

// Data
const { get } = useAxios();
const appStore = useAppStore();
const idReclamo = ref('');
const seleccion = ref([]);
const props = defineProps<{
  estado: string;
  filas: Filas[];
}>();

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
});
const visibleColumns = ref<string[]>([]);
const columnas: QTableProps['columns'] = [
  {
    name: 'prioridad',
    required: true,
    label: 'Prioridad',
    align: 'center',
    field: (row: Filas) =>
      Math.min(...row.reclamos.map((el) => el.motivo.prioridad)) == 1
        ? 'Alta'
        : Math.min(...row.reclamos.map((el) => el.motivo.prioridad)) == 2
        ? 'Media'
        : 'Mínima',
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
  { name: 'archivos', label: 'Archivos', field: 'archivos', align: 'left' },
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
    label: 'Fecha del estado',
    field: 'fecha_finalizado',
    align: 'left',
  },
  {
    name: 'reclamos',
    label: 'Productos en reclamo',
    field: 'reclamos',
    align: 'left',
  },
];
const fotos = ref<Archivo[]>([]);
const alert = ref(false);

// Methods
const mostrarArchivos = async (archivos: [number, number, number]) => {
  for (const archivo of archivos) {
    if (archivo != 0) {
      const newQuery = `/obtener_archivos/${archivo}`;
      const respuesta: RespuestaArchivo = await get(newQuery, {});
      if (respuesta.error === 'S') {
        console.error(respuesta.mensaje);
        return;
      }
      fotos.value.push(respuesta.objetos[0]);
    }
  }
  alert.value = true;
};
visibleColumns.value = columnasVisibles(props.estado);

// Computed
const filtro = computed(() => {
  if (props.estado === 'PEN') {
    return [{ label: 'En proceso', value: 'PRO' }];
  } else if (props.estado === 'PRO') {
    return [{ label: 'Finalizado', value: 'FIN' }];
  } else {
    return [];
  }
});

const estadosFiltrados = ref(filtro);

const pagesNumber = computed(() => {
  return Math.ceil(props.filas.length / pagination.value.rowsPerPage);
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}

p {
  word-break: break-all;
  white-space: normal;
}
</style>
