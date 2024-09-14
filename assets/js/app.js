import { Socket } from "phoenix";

// Verificar que el DOM se ha cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {

  // Función para generar un color aleatorio que contraste bien con un fondo blanco
  function generateRandomColor() {
    let color;
    do {
      color = Math.floor(Math.random()*16777215).toString(16); // Generar un color hexadecimal aleatorio
    } while (parseInt(color, 16) > 0xCCCCCC); // Repetir si es muy claro
    return `#${color}`;
  }

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

  // --- Código para el dropdown personalizado de estados ---
  
  // Lista de estados de la República Mexicana
  const estados = [
    "Estado de México",
    "Ciudad de México",
    "Jalisco",
    "Veracruz",
    "Puebla",
    "Guanajuato",
    "Nuevo León",
    "Chiapas",
    "Michoacán",
    "Oaxaca",
    "Chihuahua",
    "Baja California",
    "Sinaloa",
    "Sonora",
    "Coahuila",
    "Hidalgo",
    "Tamaulipas",
    "Guerrero",
    "San Luis Potosí",
    "Tabasco",
    "Querétaro",
    "Yucatán",
    "Morelos",
    "Durango",
    "Zacatecas",
    "Quintana Roo",
    "Aguascalientes",
    "Tlaxcala",
    "Nayarit",
    "Campeche",
    "Baja California Sur",
    "Colima"
  ];

  // Inicializar el componente personalizado del select
  const customSelect = document.getElementById("custom-select");
  const customOptions = document.getElementById("custom-options");
  const stateInput = document.getElementById("state");

  // Función para abrir/cerrar las opciones
  customSelect.addEventListener("click", () => {
    customOptions.classList.toggle("hidden");
  });

  // Función para cerrar las opciones al hacer clic fuera
  document.addEventListener("click", (event) => {
    if (!customSelect.contains(event.target) && !customOptions.contains(event.target)) {
      customOptions.classList.add("hidden");
    }
  });

  // Generar las opciones dinámicamente
  estados.forEach((estado) => {
    const option = document.createElement("div");
    option.classList.add("px-4", "py-2", "cursor-pointer", "hover:bg-gray-100");
    option.textContent = estado;
    option.addEventListener("click", () => {
      customSelect.textContent = estado;
      stateInput.value = estado;
      customOptions.classList.add("hidden");
    });
    customOptions.appendChild(option);
  });

  // --- Fin del código para el dropdown personalizado ---

  // Unirse al chat y actualizar el nombre de la sala
  joinForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Obtener username y estado
    let username = document.querySelector("#username").value.trim();
    // Actualizamos para obtener el valor del input oculto
    let state = stateInput.value;
    let userColor = generateRandomColor(); // Generar un color aleatorio para el usuario

    console.log(`Intentando unirse al chat del estado: ${state} con el usuario: ${username} y color: ${userColor}`);

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

          // Mostrar cuántos usuarios hay activos
          activeUsersCountElement.textContent = resp.active_users || 1;

          // Notificar al chat que el usuario se ha unido (en gris)
          let joinMessage = document.createElement("p");
          joinMessage.classList.add("text-gray-500", "italic");
          messagesContainer.appendChild(joinMessage);

          // Scroll automático al final
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
          channel.push("new_message", { message: message, color: userColor }); // Pasar el color del usuario al servidor
          chatInput.value = ""; // Limpiar el campo de entrada
        }
      });

      // Manejo de la recepción de mensajes
      channel.on("new_message", payload => {
        console.log('Nuevo mensaje recibido:', payload.message);

        // Crear el nuevo elemento del mensaje
        let messageElement = document.createElement("p");

        // Aplicar el color aleatorio al nombre del usuario y semibold
        let usernameSpan = document.createElement("span");
        usernameSpan.textContent = `${payload.user}: `;
        usernameSpan.style.color = payload.color; // Aplicar el color recibido
        usernameSpan.style.fontWeight = "600"; // Aplicar semibold

        // Agregar el mensaje del usuario
        let messageText = document.createTextNode(payload.message);

        // Añadir el nombre de usuario y el mensaje al contenedor
        messageElement.appendChild(usernameSpan);
        messageElement.appendChild(messageText);
        messageElement.classList.add("text-black");

        // Añadir el nuevo mensaje al contenedor de mensajes
        messagesContainer.appendChild(messageElement);

        // Scroll automático al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });

      // Escuchar los eventos "user_joined"
      channel.on("user_joined", payload => {
        console.log('Nuevo usuario se ha unido:', payload);
        activeUsersCountElement.textContent = payload.active_users;

        // Mostrar el mensaje de que un nuevo usuario se ha unido
        let newUserMessage = document.createElement("p");
        newUserMessage.innerHTML = `${payload.user} se ha unido al chat.`;
        newUserMessage.classList.add("text-gray-500", "italic");
        messagesContainer.appendChild(newUserMessage);

        // Scroll automático al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });

      // Actualizar cuando un usuario deja el canal
      channel.on("user_left", payload => {
        console.log('Usuario ha salido:', payload);
        activeUsersCountElement.textContent = payload.active_users;

        // Mostrar el mensaje de que un usuario ha salido
        let userLeftMessage = document.createElement("p");
        userLeftMessage.textContent = `${payload.user} ha dejado el chat.`;
        userLeftMessage.classList.add("text-gray-500", "italic");
        messagesContainer.appendChild(userLeftMessage);

        // Scroll automático al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    
    // Agregar los emojis al selector
    emojis.forEach(emoji => {
      let emojiItem = document.createElement("span");
      emojiItem.textContent = emoji;
      emojiItem.style.cursor = "pointer";
      emojiItem.addEventListener('click', () => {
        chatInput.value += emoji; // Agregar emoji al input de chat
        emojiPicker.remove(); // Cerrar el selector de emojis
      });
      emojiPicker.appendChild(emojiItem);
    });

    // Agregar el emojiPicker al DOM
    document.body.appendChild(emojiPicker);
    });
    });