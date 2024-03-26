// import React, { useState, useEffect } from "react";
import Completion from "./Complete";
import Chat from "./Chat";

function App() {
  return (
    <div>
      <div>
        <div>
          <p>Call Server API: /chat</p>
          <Completion />
          <p> ---------------------------------------------- </p>
          <p>Call Azure Functions: localhost:7071/api/chat</p>
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default App;
