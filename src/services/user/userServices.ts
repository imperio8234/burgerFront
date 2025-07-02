import { backApi } from "../baseUrl";

export interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: "admin" | "cliente";
  foto?: File | string; 
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: "admin" | "cliente";
  foto?: string | File;
}

export const userService = {
  /**
   * Registrar nuevo usuario con imagen
   */
  async register(data: CreateUsuarioDto): Promise<Usuario> {
    try {
      const formData = new FormData();
      console.log("envio de contrasena", data)
      formData.append("nombre", data.nombre);
      formData.append("correo", data.correo);
      formData.append("contrasena", data.contrasena);
      formData.append("rol", data.rol);
      if (data.foto) {
        formData.append("foto", data.foto);
      }

      const res = await backApi.post("/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al registrar usuario");
    }
  },

  /**
   * Iniciar sesión
   */
  async login(correo: string, contrasena: string): Promise<{ access_token: string; user: Usuario }> {
    try {
      const res = await backApi.post("/user/login", { correo, contrasena });
      const { access_token, user } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      return { access_token, user };
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Credenciales inválidas");
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async getAll(): Promise<Usuario[]> {
    try {
      const res = await backApi.get("/user");
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al obtener usuarios");
    }
  },

  async getById(id: string): Promise<Usuario> {
    try {
      const res = await backApi.get(`/user/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Usuario no encontrado");
    }
  },

  async update(id: string, data: Partial<CreateUsuarioDto>): Promise<Usuario> {
    try {
      const formData = new FormData();
      if (data.nombre) formData.append("nombre", data.nombre);
      if (data.correo) formData.append("correo", data.correo);
      if (data.contrasena) formData.append("contrasena", data.contrasena);
      if (data.rol) formData.append("rol", data.rol);
      if (data.foto) formData.append("foto", data.foto);

      const res = await backApi.put(`/user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al actualizar usuario");
    }
  },

  async delete(id: string): Promise<{ message: string }> {
    try {
      const res = await backApi.delete(`/user/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al eliminar usuario");
    }
  },
};
