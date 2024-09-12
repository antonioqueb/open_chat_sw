import { Socket } from "phoenix";

// Verificar que el DOM se ha cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {

  // Verificación de edad
  let ageVerification = document.getElementById("age-verification");
  let yesButton = document.getElementById("yes-button");
  let noButton = document.getElementById("no-button");

  // Lógica de verificación de edad
  if (yesButton && noButton) {
    yesButton.addEventListener("click", function () {
      ageVerification.classList.add("hidden");
      document.getElementById("welcome-section").classList.remove("hidden");
    });

    noButton.addEventListener("click", function () {
      window.location.href = "https://www.google.com";
    });
  }

  // Variables para la UI del chat
  let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  let socket = new Socket("/socket", { params: { _csrf_token: csrfToken } });
  socket.connect();
  console.log('Socket conectado'); // Verificar que el socket se conecta correctamente

  let welcomeSection = document.querySelector("#welcome-section");
  let joinForm = document.querySelector("#join-form");
  let chatContainer = document.querySelector("#chat-container");
  let chatInput = document.querySelector("#chat-input");
  let chatForm = document.querySelector("#chat-form");
  let messagesContainer = document.querySelector("#messages");
  let emojiButton = document.querySelector("#emoji-button");
  let chatRoomTitle = document.getElementById("chat-room-title"); // Título de la sala de chat
  let activeUsersCountElement = document.getElementById("active-users-count"); // Elemento donde se mostrará la cantidad de usuarios activos

  // Mostrar los elementos del DOM
  console.log('Elementos del DOM:', { joinForm, chatContainer, chatInput, chatForm, messagesContainer, emojiButton });

  // Unirse al chat y actualizar el nombre de la sala
  joinForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Obtener username y estado
    let username = document.querySelector("#username").value.trim();
    let state = document.querySelector("#state").value;
    
    console.log(`Intentando unirse al chat del estado: ${state} con el usuario: ${username}`);

    if (username !== "" && state !== "") {
      // Actualizar el título de la sala de chat
      chatRoomTitle.textContent = `${state} Swinger`;

      // Unirse al canal basado en el estado seleccionado
      let channel = socket.channel(`room:${state}`, { user: username });
      
      channel.join()
        .receive("ok", resp => {
          console.log(`Conectado exitosamente al chat del estado: ${state}`);

          // Ocultar la sección de bienvenida
          welcomeSection.classList.add("hidden");

          // Mostrar la ventana de chat
          chatContainer.classList.remove("hidden");
          chatContainer.classList.add("block");


          // Notificar al chat que un nuevo usuario se ha unido
          let joinMessage = document.createElement("p");
          joinMessage.innerHTML = `<strong class="text-green-500">${username}</strong> se ha unido al chat.`;
          messagesContainer.appendChild(joinMessage);

          // Scroll automático al final
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          // Actualizar el número de usuarios activos
          activeUsersCountElement.textContent = resp.active_users || 1;
        })
        .receive("error", resp => {
          console.error(`No se pudo conectar al chat del estado: ${state}`, resp);
        });

      // Manejo del envío de mensajes
      chatForm.addEventListener("submit", event => {
        event.preventDefault();
        let message = chatInput.value.trim();
        if (message !== "") {
          console.log('Enviando mensaje:', message);
          channel.push("new_message", { message: message });
          chatInput.value = ""; // Limpiar el campo de entrada
        }
      });

      // Escuchar los mensajes entrantes
      channel.on("new_message", payload => {
        console.log('Mensaje recibido:', payload);
        let messageItem = document.createElement("p");
        messageItem.innerHTML = `<strong class="text-blue-500">${payload.user}</strong>: ${payload.message}`;
        messagesContainer.appendChild(messageItem);

        // Scroll automático al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });

      // Actualizar el número de usuarios activos cuando un nuevo usuario se une
      channel.on("user_joined", payload => {
        console.log('Nuevo usuario se ha unido:', payload);
        activeUsersCountElement.textContent = payload.active_users;
      });

      // Actualizar cuando un usuario deja el canal
      channel.on("user_left", payload => {
        console.log('Usuario ha salido:', payload);
        activeUsersCountElement.textContent = payload.active_users;
      });
    } else {
      alert("Por favor, ingresa un nombre de usuario y selecciona un estado.");
    }
  });

  // Implementación básica de emojis usando Unicode nativo
  emojiButton.addEventListener('click', () => {
    const emojis = ['😊', '😂', '😍', '😎', '👍', '🔥', '💯', '🥳']; // Ejemplo de emojis
    let emojiPicker = document.createElement("div");
    emojiPicker.style.position = "absolute";
    emojiPicker.style.background = "#fff";
    emojiPicker.style.border = "1px solid #ddd";
    emojiPicker.style.padding = "10px";
    emojiPicker.style.display = "grid";
    emojiPicker.style.gridTemplateColumns = "repeat(4, 1fr)";
    emojiPicker.style.gap = "5px";
    
    emojis.forEach(emoji => {
      let emojiButton = document.createElement("button");
      emojiButton.textContent = emoji;
      emojiButton.style.fontSize = "20px";
      emojiButton.style.cursor = "pointer";
      emojiButton.addEventListener('click', () => {
        chatInput.value += emoji;
        emojiPicker.remove(); // Cerrar el picker después de seleccionar el emoji
      });
      emojiPicker.appendChild(emojiButton);
    });

    // Mostrar el selector de emojis cerca del botón de emoji
    document.body.appendChild(emojiPicker);
    let rect = emojiButton.getBoundingClientRect();
    emojiPicker.style.top = `${rect.bottom}px`;
    emojiPicker.style.left = `${rect.left}px`;
  });

});
