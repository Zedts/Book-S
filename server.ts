import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("join-room", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on("send-message", (data: { id: string; senderId: string; receiverId?: string; message: string; createdAt: Date }) => {
      if (data.receiverId) {
        // Emit specifically to the receiver's room
        io.to(data.receiverId).emit("receive-message", data);
      } else {
        // Example: If receiverId is not provided, maybe it's for admins
        io.emit("receive-message", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
