import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import TextField from "@material-ui/core/TextField";
import "./App.css";
import { Button } from "react-bootstrap";

const socket = io.connect("http://localhost:4000");

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState("default");

  useEffect(() => {
    socket.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  }, []);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit("message", { roomId: room, name, message });
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}:<span>{message}</span>
        </h3>
      </div>
    ));
  };

  const selectRoom = (room) => {
    setRoom(room);
    socket.emit("join", { roomId: room });
  };

  return (
    <>
      <div className="card">
        <form onSubmit={onMessageSubmit}>
          <div>현재 조인된 룸 : {room}</div>
          <h1>Message</h1>
          <div className="name-field">
            <TextField
              name="name"
              onChange={(e) => onTextChange(e)}
              value={state.name}
              label="Name"
            />
          </div>
          <div>
            <TextField
              name="message"
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
            />
          </div>
          <button>Send Message</button>
          <br />
          <Button variant="primary" onClick={() => selectRoom("default")}>
            공용방
          </Button>{" "}
          <Button variant="primary" onClick={() => selectRoom("btc")}>
            비트코인 방
          </Button>{" "}
          <Button variant="primary" onClick={() => selectRoom("eth")}>
            이더리움 방
          </Button>{" "}
        </form>
        <div className="render-chat">
          <h1>Chat log</h1>
          {renderChat()}
        </div>
      </div>
    </>
  );
}

export default App;
