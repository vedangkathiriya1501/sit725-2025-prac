const socket = io();

document.getElementById("getNumberBtn").addEventListener("click", () => {
  socket.emit("newNumberRequest");
});

socket.on("number", (num) => {
  document.getElementById("number").innerText = `Random Number: ${num}`;
});
