<template>
  <div class="q-pa-none">
    <q-table
      v-if="props.filas.length > 0"
      class="text-h6 text-grey-8 justify-center"
      style="max-height: 325px"
      square
      flat
      bordered
      no-data-label="Datos no disponibles"
      hide-no-data
      :rows="props.filas"
      :columns="props.columna"
      :filter="filter"
      row-key="id"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="columnasVisibles"
      hide-header
      hide-bottom
    >
      <template v-slot:header-cell-reclamo="props">
        <q-th :props="props"> <q-icon name="add" /> Reclamo </q-th>
      </template>

      <template v-slot:top>
        <div class="row no-wrap sq-pa-none">
          <p
            class="text-primary text-subtitle1"
            style="font-family: 'Bebas Neue'"
          >
            PRODUCTOS EN FACTURA
          </p>
          <div class="justify-end">
            <q-input
              style="align-right"
              input-class="text-right"
              clearable
              clear-icon="close"
              dense
              debounce="350"
              borderless
              color="primary"
              v-model="filter"
              placeholder="Buscar..."
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td class="col no-wrap">
            <div>{{ props.row.nombre }}</div>
            <div class="row justify-between">
              <div><strong>Cantidad:</strong> {{ props.row.cantidad }}</div>
              <div>
                <strong>Lote:</strong>
                {{ props.row.otra_info[0].lote }}
              </div>
            </div>
            <div class="row justify-between">
              <div>
                <strong>Fecha de vencimiento:</strong>
                {{ props.row.otra_info[0].fecha_vencimiento }}
              </div>
              <div>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="enviarReclamo(props.row), enviarFila(props.row.id)"
                  icon="add"
                />
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps } from 'quasar';
import { Producto } from 'components/models';

// Data
/* defined props */
const props = defineProps<{
  filas: Producto[];
  columna: QTableProps['columns'];
}>();

/* defined emits*/
const emit = defineEmits(['agregarReclamo', 'quitarFila']);

// Methods
const enviarReclamo = (event: Producto) => {
  emit('agregarReclamo', event);
};

const enviarFila = (event: number) => {
  emit('quitarFila', event);
};

const filter = ref('');
const columnasVisibles = ref(['nombre']);

const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
</script>
