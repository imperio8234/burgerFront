// src/services/email/emailService.ts

import { backApi } from "../baseUrl";


export const emailService = {
  enviarCorreoBienvenida: async (data: any): Promise<void> => {
    try {
      await backApi.post("/notificaciones/enviar-correo", data);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw error;
    }
  },
};
