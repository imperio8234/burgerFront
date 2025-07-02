// src/components/ModalRenovarToken.tsx
import { userService } from "@/services/user/userServices";
import { useState } from "react";

const ModalRenovarToken = ({ onClose }: { onClose: () => void }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const renovarSesion = async () => {
    setLoading(true);
    setError("");

    try {
      await userService.login(correo, contrasena);
      setLoading(false);
      window.location.reload(); // recarga la app con el nuevo token
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div onClick={() => onClose()} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-xl shadow-xl text-center w-[95%] max-w-md">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Sesión expirada</h2>
        <p className="text-sm text-gray-600 mb-4">Por favor ingresa tus credenciales para renovar tu sesión.</p>

        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo electrónico"
          className="w-full mb-3 px-3 py-2 border rounded-md text-sm"
        />
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContraseña(e.target.value)}
          placeholder="Contraseña"
          className="w-full mb-3 px-3 py-2 border rounded-md text-sm"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={renovarSesion}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {loading ? "Renovando..." : "Renovar sesión"}
        </button>
      </div>
    </div>
  );
};

export default ModalRenovarToken;
