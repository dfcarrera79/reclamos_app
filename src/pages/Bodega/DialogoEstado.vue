<template>
  <q-dialog v-model="appStore.confirmarFinalizado" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="primary" text-color="white" />
        <span class="q-ml-sm">Respuesta al cliente sobre el reclamo:</span>
      </q-card-section>
      <q-card-section class="q-pa-md" style="max-width: 300px">
        <q-input v-model="respuestaFinalizado" filled type="textarea" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          v-close-popup
          @click="appStore.select = false"
        />
        <q-btn
          flat
          label="Cambiar estado"
          color="primary"
          v-close-popup
          @click.prevent="actualizarReclamo(props.idReclamo)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../../stores/useAppStore';
import { useAxios } from '../../services/useAxios';
import { ReclamoActualizado } from 'components/models';

// Data
const props = defineProps(['idReclamo', 'seleccion']);
const appStore = useAppStore();
const { put } = useAxios();
const reclamoActualizado = ref<ReclamoActualizado>({
  id_reclamo: 0,
  estado: '',
  login_usuario: '',
  nombre_usuario: '',
  respuesta_finalizado: '',
});
const respuestaFinalizado = ref('');

// Methods
const actualizarReclamo = async (id: number) => {
  reclamoActualizado.value = {
    id_reclamo: id,
    estado: props.seleccion,
    login_usuario: appStore.usuario.ruc_cliente,
    nombre_usuario: appStore.usuario.razon_social,
    respuesta_finalizado: respuestaFinalizado.value,
  };
  await put(
    '/actualizar_estado',
    {},
    JSON.parse(JSON.stringify(reclamoActualizado.value))
  );
  window.location.reload();
};
</script>
