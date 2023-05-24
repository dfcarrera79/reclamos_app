import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';

interface user {
  id: string;
  clave: string;
}

export const useAppStore = defineStore('oApp', {
  state: () => ({
    APP_CLIENTE: 1,
    APP_USUARIO: 2,
    codigo_empresa_reclamos: 4,
    urlApi: 'http://localhost:8000',
    appCodigo: 1,
    usuario: { id: '', clave: '' },
    estaLogeado: false,
    url: window.location.href,
    confirmar: false,
    confirmarFinalizado: false,
    select: false,
    desde: null,
    hasta: null,
    factura: '',
    ruc: '',
  }),

  getters: {
    getURLApi(state) {
      return state.urlApi;
    },
    getHttpHeaders(state) {
      return {
        'Content-Type': 'application/json',
        codigo_empresa: state.codigo_empresa_reclamos,
        ruc: state.usuario.id,
        clave: state.usuario.clave,
      };
    },
  },

  actions: {
    iniciarSession(usuario: user) {
      this.usuario = usuario;
      this.estaLogeado = true;
      LocalStorage.set('session', {
        usuario: this.usuario,
        estaLogeado: this.estaLogeado,
        appCodigo: this.appCodigo,
        currentURL: this.url,
      });
    },
    cerrarSession() {
      this.usuario = { id: '', clave: '' };
      this.estaLogeado = false;
      LocalStorage.clear;
    },
    actualizarRUC(nuevoRuc: string) {
      this.usuario.id = nuevoRuc;
    },
  },
});
