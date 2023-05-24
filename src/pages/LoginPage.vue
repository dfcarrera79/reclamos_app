<template>
  <q-page class="flex flex-center bg-blue-grey-1">
    <q-card class="shadow-8 bg-white" style="width: 300px; height: 260px">
      <div class="row bg-blue-grey-8 justify-center q-pa-xs">
        <span class="text-subtitle2 text-center text-white"
          >PORTAL DE RECLAMOS v1.1</span
        >
      </div>
      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <q-input
            v-model="appStore.usuario.id"
            type="text"
            :label="`${
              appStore.appCodigo === appStore.APP_CLIENTE ? 'No. RUC' : 'Login'
            }`"
            dense
          />
        </div>
        <div class="column col-xs-12 q-pa-sm">
          <q-input
            v-model="appStore.usuario.clave"
            type="password"
            label="Clave - Por defecto su Identificación"
            dense
          />
        </div>
      </div>
      <q-separator dark />
      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <q-btn
            class="full-width text-white"
            style="height: 40px"
            color="blue"
            label="Ingresar"
            @click="logearse()"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LocalStorage, useQuasar, QSpinnerFacebook } from 'quasar';
import { useAppStore } from '../stores/useAppStore';
import { useMensajes } from '../services/useMensajes';
import { useAxios } from '../services/useAxios';

const router = useRouter();
const route = useRoute();
const q = useQuasar();
const appStore = useAppStore();
const { get } = useAxios();
const { mostrarMensaje } = useMensajes();
const url = ref(appStore.url);
const newUrl = ref(url.value.slice(url.value.indexOf('#') + 1));

onMounted(() => {
  appStore.appCodigo = parseInt(route.params.appcodigo);
  const session = LocalStorage.getItem('session');

  if (session) {
    appStore.appCodigo = parseInt(session.appCodigo);
    appStore.iniciarSession(session.usuario);
    router.push(newUrl.value);
  }
});

const logearse = async () => {
  if (appStore.usuario.id.trim().length === 0) {
    mostrarMensaje(
      'Error',
      appStore.appCodigo === appStore.APP_CLIENTE
        ? 'Ingrese su número de RUC'
        : 'Ingrese su login'
    );
    return;
  }
  if (appStore.usuario.clave.trim().length === 0) {
    mostrarMensaje('Error', 'Es obligatorio ingresar su clave de acceso');
    return;
  }
  q.loading.show({
    spinner: QSpinnerFacebook,
    message: 'Verificando acceso...',
  });
  const respuesta = await get('/validar_usuario', {
    id: appStore.usuario.id,
    clave: appStore.usuario.clave,
    appCodigo: appStore.appCodigo,
  });
  q.loading.hide();
  if (respuesta.error === 'S') {
    mostrarMensaje('Error', respuesta.mensaje);
    return;
  }
  appStore.iniciarSession(respuesta.objetos);
  router.push('/editar_reclamo');
};
</script>
