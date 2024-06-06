import React, { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const HTTP = "http://localhost:3003/chat";

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(HTTP, { prompt })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };

  const handlePrompt = (e) => setPrompt(e.target.value);

  return (
    <div>
      <h1>Hello</h1>
      <form onSubmit={handleSubmit}>
        <label>Question Here: </label>
        <input
          type="text"
          placeholder="enter"
          value={prompt}
          onChange={handlePrompt}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>{response ? response : "No questions yet..."}</p>
      </div>
    </div>
  );
}