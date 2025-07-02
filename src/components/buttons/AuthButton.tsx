import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { LogIn, X} from "lucide-react";
import { useForm } from "react-hook-form";
import { userService } from "../../services/user/userServices";
import { useAuth } from "../context/AuthContext";


type AuthForm = {
  nombre?: string;
  correo: string;
  contrasena: string;
  rol?: "admin" | "cliente";
  foto?: string;
};

export const AuthButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const {login} = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthForm>();

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: AuthForm) => {
    setLoading(true);
    try {
      if (tab === "login") {
       const user = await userService.login(data.correo, data.contrasena);
        login(user)
        alert("Sesión iniciada correctamente");
      } else {
        await userService.register({
          nombre: data.nombre!,
          correo: data.correo,
          contrasena: data.contrasena,
          rol: data.rol!,
          foto: data.foto,
        });
        alert("Usuario registrado correctamente");
      }
      closeModal();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-500 rounded-full text-sm hover:bg-yellow-50"
      >
        <LogIn size={16} />
        Iniciar Sesión
      </button>

      <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-md z-50 relative">
          <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>

          <div className="flex justify-between mb-6">
            <button
              onClick={() => setTab("login")}
              className={`text-sm font-semibold ${tab === "login" ? "text-yellow-500" : "text-gray-500"}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setTab("register")}
              className={`text-sm font-semibold ${tab === "register" ? "text-yellow-500" : "text-gray-500"}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
            {tab === "register" && (
              <>
                <input
                  {...register("nombre", { required: true })}
                  placeholder="Nombre completo"
                  className="w-full border px-4 py-2 rounded"
                />
                {errors.nombre && <p className="text-red-500 text-xs">Este campo es obligatorio</p>}
              </>
            )}

            <input
              {...register("correo", { required: true })}
              placeholder="Correo"
              type="email"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.correo && <p className="text-red-500 text-xs">Correo requerido</p>}

            <input
              {...register("contrasena", { required: true })}
              placeholder="Contraseña"
              type="password"
              className="w-full border px-4 py-2 rounded"
            />
            {errors.contrasena && <p className="text-red-500 text-xs">Contraseña requerida</p>}

            {tab === "register" && (
              <>
                <select
                  {...register("rol", { required: true })}
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.rol && <p className="text-red-500 text-xs">Rol requerido</p>}

                <input
                  {...register("foto")}
                  placeholder="URL de la foto (opcional)"
                  className="w-full border px-4 py-2 rounded"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {loading ? "Procesando..." : tab === "login" ? "Entrar" : "Registrarse"}
            </button>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};
