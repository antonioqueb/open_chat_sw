# lib\open_chat_web\channels\user_socket.ex
defmodule OpenChatWeb.UserSocket do
  use Phoenix.Socket

  # Canales dinámicos según el estado
  channel "room:*", OpenChatWeb.ChatChannel

  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
