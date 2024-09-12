defmodule OpenChatWeb.ChatChannel do
  use OpenChatWeb, :channel
  alias OpenChat.ChatStorage

  @table :chat_active_users

  # Aceptamos el estado del usuario cuando se une a la sala
  def join("room:" <> state, params, socket) do
    IO.inspect(params, label: "Parámetros recibidos")
    IO.inspect(socket, label: "Socket recibido")

    user = params["user"] || "User_#{:rand.uniform(1000)}"
    socket = assign(socket, :user, user)
    socket = assign(socket, :state, state)

    # Enviar un mensaje a sí mismo para manejar después de unirse completamente
    send(self(), :after_join)

    # Devolver la cantidad de usuarios activos en la sala al usuario que acaba de unirse
    {:ok, %{active_users: count_active_users(state)}, socket}
  end

  # Nueva función handle_info para manejar la lógica después de unirse
  def handle_info(:after_join, socket) do
    # Incrementar el número de usuarios activos en la sala
    active_users = increment_active_users(socket.assigns.state)

    # Notificar a los usuarios que un nuevo usuario se ha unido y enviar el conteo actualizado
    broadcast!(socket, "user_joined", %{active_users: active_users})

    {:noreply, socket}
  end

  # Cuando el usuario abandona el canal
  def terminate(_reason, socket) do
    state = socket.assigns.state
    active_users = decrement_active_users(state)

    # Notificar que un usuario ha salido y actualizar el número de usuarios activos
    broadcast!(socket, "user_left", %{active_users: active_users})
    :ok
  end

  def handle_in("new_message", %{"message" => message}, socket) do
    # Broadcast del mensaje a todos los usuarios conectados
    broadcast!(socket, "new_message", %{user: socket.assigns.user, message: message})

    # Guardar el mensaje en un archivo de texto según el estado
    ChatStorage.save_message(socket.assigns.state, socket.assigns.user, message)

    {:noreply, socket}
  end

  # Incrementa el número de usuarios activos en la sala y devuelve el número actualizado
  defp increment_active_users(state) do
    :ets.update_counter(@table, state, {2, 1}, {state, 0})
  end

  # Decrementa el número de usuarios activos en la sala y devuelve el número actualizado
  defp decrement_active_users(state) do
    case :ets.lookup(@table, state) do
      [{^state, count}] when count > 0 ->
        :ets.update_counter(@table, state, {2, -1})
      _ -> 0
    end
  end

  # Función para contar usuarios activos en la sala
  defp count_active_users(state) do
    case :ets.lookup(@table, state) do
      [{^state, count}] -> count
      [] -> 0
    end
  end
end
