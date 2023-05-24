<template>
  <q-page padding>
    <h4
      class="text-grey-8"
      style="font-family: 'Bebas Neue'"
      v-if="!($q.screen.lt.md || $q.screen.lt.sm)"
    >
      INGRESAR RECLAMO
    </h4>
    <h4
      class="text-grey-8 q-ma-xs"
      style="font-family: 'Bebas Neue'"
      v-if="$q.screen.lt.md"
    >
      INGRESAR RECLAMO
    </h4>
    <q-form
      class="row"
      style="max-width: 800px"
      enctype="multipart/form-data"
      @submit.prevent="procesarFormulario"
    >
      <div
        class="col-12 text-grey-8"
        v-if="!($q.screen.lt.md || $q.screen.lt.sm)"
      >
        <p>
          <strong>Nota:</strong> Una vez enviado el reclamo, este no se puede
          editar.
        </p>
      </div>
      <div v-if="!($q.screen.lt.md || $q.screen.lt.sm)" class="row">
        <q-input
          class="q-ma-sm"
          square
          debounce="350"
          v-model="ruc"
          type="text"
          label="RUC"
          :disable="appStore.appCodigo === appStore.APP_CLIENTE"
          outlined
          dense
          options-dense
          clearable
          clear-icon="close"
        />
        <q-input
          class="q-ma-sm"
          square
          debounce="350"
          label="Número de factura"
          v-model="factura"
          hint="Ej: 001-001-010001"
          placeholder="001-001-010001"
          :rules="[
            (val) => !!val || '* Requerido',
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
        <q-btn
          class="q-ma-sm"
          outline
          square
          color="primary"
          style="height: 40px; width: 183px"
          type="submit"
        >
          <div class="row items-center no-wrap q-pa-none">
            <div class="text-center text-caption">
              <strong>Consultar productos</strong>
            </div>
          </div>
        </q-btn>
      </div>
      <div v-if="$q.screen.lt.md">
        <div class="row no-wrap">
          <q-input
            class="q-ma-sm"
            square
            debounce="350"
            v-model="ruc"
            type="text"
            label="RUC"
            :disable="appStore.appCodigo === appStore.APP_CLIENTE"
            outlined
            dense
            options-dense
            clearable
            clear-icon="close"
          />
          <q-input
            class="q-ma-sm"
            square
            debounce="350"
            label="Número de factura"
            v-model="factura"
            hint="Ej: 001-001-010001"
            placeholder="001-001-010001"
            :rules="[
              (val) => !!val || '* Requerido',
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
          <q-btn
            class="q-ma-sm"
            round
            color="primary"
            style="height: 40px; width: 40px"
            type="submit"
            icon="search"
          />
        </div>
      </div>
    </q-form>

    <div
      class="fit row no-wrap justify-start items-start content-start"
      v-if="filas.length === 0 && detalles.length === 0"
    >
      <div class="column no-wrap items-center" style="margin-top: 20px">
        <p class="text-secondary text-h5" style="font-family: 'Bebas Neue'">
          COMENCEMOS
        </p>
        <p class="text-secondary text-body2">
          <strong
            >Ingrese el ruc y el número de factura para consultar los productos
          </strong>
        </p>
      </div>
    </div>

    <div class="fit row wrap justify-start" style="max-height: 800px">
      <div class="q-pa-xs">
        <div
          class="fit row no-wrap justify-evenly"
          v-if="!($q.screen.lt.md || $q.screen.lt.sm)"
        >
          <ProductosComponent
            v-if="filas.length > 0"
            :filas="filas"
            :columnas="columnas"
            @agregarReclamo="agregarReclamo($event)"
            @quitarFila="quitarFila($event)"
          />
          <q-card
            class="q-mt-md"
            style="max-height: 95vh"
            bordered
            square
            flat
            v-if="detalles.length !== 0"
          >
            <q-card-section>
              <div class="row no-wrap items-start q-mt-sm q-ml-sm">
                <p
                  class="text-primary text-h6 q-ma-none"
                  style="font-family: 'Bebas Neue'"
                >
                  PRODUCTOS EN RECLAMOS
                </p>
                <q-space />
                <q-btn
                  class="q-ma-none q-mt-xs"
                  size="sm"
                  square
                  color="primary"
                  label="Enviar"
                  :disable="
                    detalles.map((el) => el.comentario).includes('') ||
                    detalles.map((el) => el.motivo.id_motivo).includes(0)
                  "
                  @click="procesarEnvio"
                />
                <q-btn
                  class="q-ml-sm q-mt-xs"
                  color="primary"
                  outline
                  square
                  size="sm"
                  label="cancelar"
                  @click="reset"
                >
                  <q-tooltip> Elimina todos los reclamos </q-tooltip>
                </q-btn>
              </div>
              <div class="row no-wrap q-ma-sm">
                <p class="text-caption text-grey-8">
                  Al finalizar de detallar los reclamos, dar click en el botón
                  <strong> ENVIAR</strong>.
                </p>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 80vh" class="scroll">
              <div v-for="(detalle, index) in detalles" :key="index">
                <Reclamo
                  :detalle="detalle"
                  @agregarFila="insertarFila($event)"
                  @eliminarReclamo="quitarReclamo($event)"
                  @actualizarComentario="renovarComentario($event)"
                  @actualizarMotivo="renovarMotivo($event)"
                  @actualizarArchivo1="renovarArchivo1($event)"
                  @actualizarArchivo2="renovarArchivo2($event)"
                  @actualizarArchivo3="renovarArchivo3($event)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="fit column wrap content-center" v-if="$q.screen.lt.md">
          <ProductosComponentMovil
            v-if="$q.screen.lt.md"
            :filas="filas"
            :columna="columna"
            @agregarReclamo="agregarReclamo($event)"
            @quitarFila="quitarFila($event)"
          />

          <q-card
            class="q-mt-md"
            style="max-height: 95vh"
            bordered
            square
            flat
            v-if="detalles.length !== 0"
          >
            <q-card-section class="q-pa-none">
              <div class="row no-wrap items-start q-mt-sm q-ml-sm">
                <p
                  class="text-primary text-subtitle1 q-ma-none"
                  style="font-family: 'Bebas Neue'"
                >
                  PRODUCTOS EN RECLAMOS
                </p>
                <q-space />
                <q-btn
                  class="q-ma-none q-mt-xs"
                  size="sm"
                  square
                  color="primary"
                  label="Enviar"
                  :disable="
                    detalles.map((el) => el.comentario).includes('') ||
                    detalles.map((el) => el.motivo.id_motivo).includes(0)
                  "
                  @click="procesarEnvio"
                />
                <q-btn
                  class="q-ml-sm q-mt-xs"
                  color="primary"
                  outline
                  square
                  size="sm"
                  label="cancelar"
                  @click="reset"
                >
                  <q-tooltip> Elimina todos los reclamos </q-tooltip>
                </q-btn>
              </div>
              <div class="row no-wrap q-ma-sm">
                <p class="text-caption text-grey-8">
                  Al finalizar de detallar los reclamos, dar click en
                  <strong> ENVIAR</strong>.
                </p>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 80vh" class="scroll">
              <div v-for="(detalle, index) in detalles" :key="index">
                <ReclamoMovil
                  :detalle="detalle"
                  @agregarFila="insertarFila($event)"
                  @eliminarReclamo="quitarReclamo($event)"
                  @actualizarComentario="renovarComentario($event)"
                  @actualizarMotivo="renovarMotivo($event)"
                  @actualizarArchivo1="renovarArchivo1($event)"
                  @actualizarArchivo2="renovarArchivo2($event)"
                  @actualizarArchivo3="renovarArchivo3($event)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAxios } from '../../services/useAxios';
import { useQuasar } from 'quasar';
import { QTableProps } from 'quasar';
import { useMensajes } from '../../services/useMensajes';
import { useAppStore } from '../../stores/useAppStore';
import { ref, onMounted } from 'vue';
import Reclamo from './ReclamoComponent.vue';
import ReclamoMovil from './ReclamoComponentMovil.vue';
import ProductosComponent from 'src/pages/EditarReclamo/ProductosComponent.vue';
import ProductosComponentMovil from 'src/pages/EditarReclamo/ProductosComponentMovil.vue';
import {
  Arch,
  Detalle,
  Motivo,
  Reclamos,
  Item,
  Producto,
  Respuesta,
} from 'components/models';

// Datos
const appStore = useAppStore();
const { get, post, deletes, put } = useAxios();
const { mostrarError } = useMensajes();

const motivos = ref<Motivo[]>([]);
const $q = useQuasar();
const ruc = ref(
  appStore.appCodigo === appStore.APP_CLIENTE
    ? appStore.usuario.ruc_cliente
    : ''
);
const factura = ref('');
const formatoFactura = /([0-9]{3}-[0-9]{3}-[0-9]{6})/;

const filasOriginales = ref<Producto[]>([]);
let originalRows: Producto[];
const filas = ref(filasOriginales);
const columna: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'ID', field: 'id' },
  {
    name: 'nombre',
    align: 'left',
    label: '',
    field: 'nombre',
    sortable: true,
  },
];
const columnas: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'ID', field: 'id' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'fecha',
    required: true,
    label: 'Fecha de vencimiento',
    align: 'center',
    field: (row: Producto) => row.otra_info[0].fecha_vencimiento,
    sortable: true,
  },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  {
    name: 'lote',
    required: true,
    label: 'Lote',
    align: 'center',
    field: (row: Producto) => row.otra_info[0].lote,
  },
  { name: 'reclamo', align: 'center', label: '', field: 'id' },
];
const archivos = ref<number[]>([]);

const arch = ref<Arch>({ id_detalle: 0, id_archivo: 0 });
const idDetalle = ref(0);
const reclamos = ref<Reclamos>({
  tipo: 0,
  no_factura: '',
  ruc_reclamante: '',
  reclamos: '',
});
const detalles = ref<Detalle[]>([]);

// Methods
onMounted(async () => {
  const respuesta = await get('/obtener_motivos', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  motivos.value = respuesta.objetos;
});

const procesarFormulario = async () => {
  if (ruc.value.trim().length === 0 || factura.value.trim().length === 0) {
    mostrarError(
      'Es necesario llenar los campos Ruc y número de factura',
      'center'
    );
    return;
  }

  const formulario = {
    ruc_reclamante: ruc.value,
    no_factura: factura.value,
  };

  const productos = await get('/obtener_productos', formulario);
  filasOriginales.value = productos.objetos.map((item: Item) => {
    let otra_info = item.conteo_pedido ? item.conteo_pedido : '';
    if (otra_info.trim().length === 0) {
      otra_info = JSON.stringify([
        {
          cantidad: item.dt_cant,
          cantidad_x_uni: 13,
          fecha_corta: false,
          fecha_vencimiento: item.dt_fecha,
          lote: item.dt_lote,
          r_sanitario: '',
        },
      ]);
    }
    return {
      id: item.art_codigo,
      nombre: item.art_nomlar,
      cantidad: item.dt_cant,
      otra_info: JSON.parse(otra_info),
    };
  });
  originalRows = filasOriginales.value;
};

const reset = async () => {
  const reclamosIDs = detalles.value.map((el) => el.producto.id);

  if (reclamosIDs.length > 0) {
    for (let reclamoID of reclamosIDs) {
      insertarFila(reclamoID);
    }
  }

  detalles.value = [];
  await deletes('/eliminar_archivos', {}, {});
};

const deducirMensaje = (resp: Respuesta) => {
  $q.notify({
    color: resp.error === 'N' ? 'green-4' : 'red-5',
    textColor: 'white',
    icon: resp.error === 'N' ? 'cloud_done' : 'warning',
    message: resp.mensaje,
  });
};

const grabarReclamo = async (tipoReclamo: number) => {
  reclamos.value.tipo = tipoReclamo;
  reclamos.value.no_factura = factura.value;
  reclamos.value.reclamos = JSON.stringify(detalles.value);
  reclamos.value.ruc_reclamante = ruc.value;

  const respuesta = await post(
    '/crear_detalle',
    {},
    JSON.parse(JSON.stringify(reclamos.value))
  );
  deducirMensaje(respuesta);
  idDetalle.value = respuesta.objetos;

  arch.value.id_detalle = idDetalle.value;

  for (let i = 0; i < archivos.value.length; i++) {
    arch.value.id_archivo = archivos.value[i];
    await put(
      '/actualizar_archivos',
      {},
      JSON.parse(JSON.stringify(arch.value))
    );
  }

  await deletes('/eliminar_archivos', {}, {});
  archivos.value = [];
  console.log('[ARCHIVOS ELIMINADOS]');
};

/**
 * Saca todos los elementos del arreglo archivo de cada producto.
 * Si el elemento es diferente de cero, lo coloca en el arreglo archivo.
 */

const obtenerArchivos = (): void => {
  if (detalles.value.length > 0) {
    const arch = detalles.value.map((el) => el.archivos);
    for (let i = 0; i < arch.length; i++) {
      for (let j = 0; j < arch[i].length; j++) {
        if (arch[i][j] != 0) {
          archivos.value.push(arch[i][j]);
        }
      }
    }
  }
};

const procesarEnvio = () => {
  obtenerArchivos();
  grabarReclamo(appStore.appCodigo);
  const ids = detalles.value.map((el) => el.producto.id);

  for (const id of ids) {
    detalles.value = detalles.value.filter((el) => el.producto.id !== id);
  }

  reclamos.value = {
    tipo: 0,
    no_factura: '',
    ruc_reclamante: '',
    reclamos: '',
  };

  filasOriginales.value = [];
};

const agregarReclamo = (event: Producto): void => {
  detalles.value.push({
    producto: event,
    motivo: {
      id_motivo: 0,
      nombre_motivo: '',
      prioridad: 3,
    },
    comentario: '',
    archivos: [0, 0, 0],
  });
};

const insertarFila = (event: number) => {
  const index = originalRows.findIndex((x) => x.id === event);
  const row = originalRows[index];
  const newRow = { ...row }; // extend({}, row, { name: `${row.name} (${row.__count})` })
  filas.value = [
    ...filas.value.slice(0, index),
    newRow,
    ...filas.value.slice(index),
  ];
};

const quitarFila = (event: number) => {
  const index = filas.value.findIndex((x) => x.id === event);
  if (index > -1) {
    // only splice array when item is found
    filas.value = [
      ...filas.value.slice(0, index),
      ...filas.value.slice(index + 1),
    ];
  }
};

const quitarReclamo = (event: number) => {
  detalles.value = detalles.value.filter((el) => el.producto.id !== event);
};

const renovarComentario = (event: Detalle) => {
  detalles.value = detalles.value.map((detalle) => {
    if (detalle.producto.id === event.producto.id) {
      detalle = event;
    }
    return detalle;
  });
};

const renovarMotivo = (event: Detalle) => {
  detalles.value = detalles.value.map((detalle) => {
    if (detalle.producto.id === event.producto.id) {
      detalle = event;
    }
    return detalle;
  });
};

const renovarArchivo1 = (event: Detalle) => {
  detalles.value = detalles.value.map((detalle) => {
    if (detalle.producto.id === event.producto.id) {
      detalle.archivos[0] = event.archivos[0];
    }
    return detalle;
  });
};

const renovarArchivo2 = (event: Detalle) => {
  detalles.value = detalles.value.map((detalle) => {
    if (detalle.producto.id === event.producto.id) {
      detalle.archivos[1] = event.archivos[1];
    }
    return detalle;
  });
};

const renovarArchivo3 = (event: Detalle) => {
  detalles.value = detalles.value.map((detalle) => {
    if (detalle.producto.id === event.producto.id) {
      detalle.archivos[2] = event.archivos[2];
    }
    return detalle;
  });
};
</script>
