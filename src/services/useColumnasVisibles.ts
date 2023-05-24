export const columnasVisibles = (est: string): string[] => {
  if (est === 'PEN') {
    return ['numero', 'fecha', 'ruc', 'cliente', 'factura', 'reclamos'];
  } else if (est === 'PRO') {
    return [
      'numero',
      'fecha',
      'ruc',
      'cliente',
      'factura',
      'reclamos',
      'fecha_enproceso',
    ];
  } else if (est === 'FIN') {
    return [
      'numero',
      'fecha',
      'ruc',
      'cliente',
      'factura',
      'reclamos',
      'fecha_finalizado',
    ];
  } else {
    console.log('[ERROR EN COLUMNAS VISIBLES]');
    return [''];
  }
};
