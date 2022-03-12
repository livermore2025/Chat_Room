const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { join } = require("path");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join Room", async ({ roomId }) => {
    console.log("join Room");
    console.log(roomId);
    // 소켓이 들어가있는 룸들을 다 disconnect
    console.log(socket.rooms);
    for (let room of [...socket.rooms].slice(1)) {
      socket.leave(room);
    }
    // 새로 들어온 roomid 로 join
    socket.join(roomId);
    console.log(socket.rooms);
  });
  socket.on("message", ({ name, message }) => {
    console.log(name, message);
    // 받은 roomId로 이름과 메시지를 전송
    io.to([...socket.rooms][1]).emit("message", { name, message });
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
server.listen(4000, function () {
  console.log("listening on port 4000");
});
