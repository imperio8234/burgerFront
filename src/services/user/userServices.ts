import { backApi } from "../baseUrl";

export interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: "admin" | "cliente";
  foto?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: "admin" | "cliente";
  foto?: string;
}

export const userService = {
  /**
   * Registrar nuevo usuario
   */
  async register(data: CreateUsuarioDto): Promise<Usuario> {
    try {
      const res = await backApi.post("/user", data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al registrar usuario");
    }
  },

  /**
   * Iniciar sesión
   */
  async login(correo: string, contraseña: string): Promise<{ access_token: string; user: Usuario }> {
    try {
      const res = await backApi.post("/user/login", { correo, contraseña });
      const { access_token, user } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      return { access_token, user };
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Credenciales inválidas");
    }
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<Usuario[]> {
    try {
      const res = await backApi.get("/user");
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al obtener usuarios");
    }
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id: string): Promise<Usuario> {
    try {
      const res = await backApi.get(`/user/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Usuario no encontrado");
    }
  },

  /**
   * Actualizar usuario
   */
  async update(id: string, data: Partial<CreateUsuarioDto>): Promise<Usuario> {
    try {
      const res = await backApi.put(`/user/${id}`, data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al actualizar usuario");
    }
  },

  /**
   * Eliminar usuario
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const res = await backApi.delete(`/user/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error al eliminar usuario");
    }
  },
};
