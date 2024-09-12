# lib\open_chat_web\live\chat_live.ex
defmodule OpenChatWeb.ChatLive do
  use Phoenix.LiveView

  def mount(_params, _session, socket) do
    {:ok, assign(socket, messages: [])}
  end

  def handle_event("send_message", %{"message" => message}, socket) do
    {:noreply, assign(socket, :messages, socket.assigns.messages ++ [%{user: "me", message: message}])}
  end
end
