import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// message 저장소
let messages = [];

io.on("connection", (socket) => {
  // 여기서부터 채팅방 연결 ----------------------------------------------------------------
  const randNum = Math.floor(Math.random() * 1000) + 1;
  const loginMessage = {
    id: `${socket.id}-${randNum}`,
    content: "사용자가 연결되었습니다",
    sender: `사용자 ${randNum}`,
    timestamp: new Date().toLocaleString(),
  };

  // 서버 로그
  console.log(`사용자 ${socket.id}-${randNum}가 연결되었습니다`);

  // 메시지를 보낸 클라를 제외한 모든 클라에게 로그인 메시지 전송
  socket.broadcast.emit("SEND_MESSAGE", JSON.stringify(loginMessage));

  // 여기서부터 채팅 ----------------------------------------------------------------
  // 클라로부터 메시지 수신
  socket.on("SEND_MESSAGE", (msg) => {
    const message = {
      id: `${socket.id}-${randNum}`,
      content: msg,
      sender: `사용자 ${randNum}`,
      timestamp: new Date().toLocaleString(),
    };

    // 서버 로그
    console.log(`${socket.id}: `, msg);

    // message 에 채팅 데이터 저장
    messages.push(message);

    // 메시지를 보낸 클라를 포함한 모든 클라에게 메시지 전송
    io.emit("SEND_MESSAGE", JSON.stringify(message));
  });

  // 여기서부터 채팅방 연결 해제 ----------------------------------------------------------------
  socket.on("disconnect", () => {
    const logOutMessage = {
      id: `${socket.id}-${randNum}`,
      content: "사용자가 연결을 끊었습니다",
      sender: `사용자 ${randNum}`,
      timestamp: new Date().toLocaleString(),
    };

    // 서버 로그
    console.log(`사용자 ${socket.id}-${randNum}연결을 끊었습니다`);

    // 메시지를 보낸 클라를 제외한 모든 클라에게 로그아웃 메시지 전송
    socket.broadcast.emit("SEND_MESSAGE", JSON.stringify(logOutMessage));
  });
});

// 채팅 기록 조회
app.get("/messages", (req, res) => {
  res.status(200).json(JSON.stringify(messages));
});

app.use(express.static(path.join(path.resolve(), "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "index.html"));
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
