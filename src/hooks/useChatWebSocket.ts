import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Hook khusus untuk mengelola koneksi lifecycle WebSocket (Socket.io).
 * Menggunakan window.location.origin karena diserve via Next.js Custom Server.
 * 
 * @param userId - ID User / Admin untuk me-registrasikan room spesifik mereka
 * @returns { socket, isConnected }
 */
export function useChatWebSocket(userId: string | null | undefined) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Jika tidak ada userId (misal saat belum login), jangan lakukan koneksi
    if (!userId) return;

    // Menginisialisasi koneksi WebSocket
    const socketInstance = io(window.location.origin, {
      reconnection: true,     // otomatis reconnect bila koneksi terputus sesaat
      reconnectionDelay: 1000, 
    });

    // Menarik Listener: Connect
    socketInstance.on("connect", () => {
      setIsConnected(true);
      // Menyuruh server untuk memposisikan client ini di custom 'room' ID-nya
      socketInstance.emit("join-room", userId);
    });

    // Menarik Listener: Disconnect
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Simpan instance ke dalam state agar bisa diakses component pembungkus
    setTimeout(() => {
      setSocket(socketInstance);
    }, 0);

    // Clean-up function (Guard): pastikan memutus koneksi bila component unmount / userId berubah
    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [userId]);

  return { socket, isConnected };
}
