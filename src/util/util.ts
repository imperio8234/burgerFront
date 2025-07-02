export function generarCodigoVerificacion(length: number = 6): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres[index];
  }
  return codigo;
}
