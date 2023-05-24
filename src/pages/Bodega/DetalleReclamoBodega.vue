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

  <DialogoEstado :idReclamo="idReclamo" :seleccion="seleccion" />

  <div>
    <q-table
      square
      flat
      bordered
      class="text-h6 text-grey-8"
      :rows="props.filas"
      :columns="columnas"
      row-key="nro_reclamo"
      hide-bottom
      v-model:pagination="pagination"
      hide-pagination
      :visible-columns="visibleColumns"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            style="text-align: center"
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label.toUpperCase() }}
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
            <template v-if="col.name === 'prioridad'">
              <template v-if="col.value == 'Alta'">
                <q-badge rounded color="negative"> {{ col.value }} </q-badge>
              </template>
              <template v-else-if="col.value == 'Media'">
                <q-badge rounded color="warning"> {{ col.value }} </q-badge>
              </template>
              <template v-else>
                <q-badge rounded color="grey-5"> {{ col.value }} </q-badge>
              </template>
            </template>
            <template v-else>
              {{ col.value }}
            </template>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
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

            <div class="text-left" v-show="estado !== 'PEN'">
              <strong>Encargado del reclamo: </strong>
              {{ props.row.nombre_usuario }}
            </div>
            <div class="text-left" v-show="estado !== 'PEN'">
              <strong>Respuesta al reclamo: </strong>
              <span v-html="props.row.respuesta_finalizado"></span>
            </div>

            <div class="row wrap">
              <div
                class="q-ma-sm"
                v-for="reclamo in props.row.reclamos"
                :key="reclamo.producto.id"
              >
                <q-card bordered square flat class="bg-grey-1 my-card">
                  <q-card-section>
                    <p class="text-h7">{{ reclamo.producto.nombre }}</p>
                  </q-card-section>

                  <q-separator inset />

                  <q-card-section>
                    <p class="text-left">
                      <strong>Motivo:</strong>
                      {{ reclamo.motivo.nombre_motivo }}
                    </p>
                    <p class="text-left">
                      <strong>Detalle: </strong>
                      <span v-html="reclamo.comentario"></span>
                    </p>
                    <p
                      class="text-left"
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
import { useAppStore } from '../../stores/useAppStore';
import { columnasVisibles } from '../../services/useColumnasVisibles.js';
import DialogoEstado from './DialogoEstado.vue';
import { Archivo, Filas, RespuestaArchivo } from 'components/models';

// Data
const { get } = useAxios();
const appStore = useAppStore();
const idReclamo = ref('');
const seleccion = ref('');
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
