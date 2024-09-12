# lib\open_chat_web\controllers\chat_controller.ex
defmodule OpenChatWeb.ChatController do
  use OpenChatWeb, :controller

  def index(conn, _params) do
    # Renderiza la misma vista que la página principal
    render(conn, "home.html")
  end
end
