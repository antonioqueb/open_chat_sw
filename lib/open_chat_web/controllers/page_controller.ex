defmodule OpenChatWeb.PageController do
  use OpenChatWeb, :controller

  def home(conn, _params) do
    conn
    |> assign(:page_title, "Bienvenido a Swinger Chat México")
    |> assign(:meta_description, "Descripción del chat más interactivo")
    |> render(:home, layout: {OpenChatWeb.Layouts, :root})
  end

  def terms(conn, _params) do
    conn
    |> assign(:page_title, "Términos y Condiciones")
    |> assign(:meta_description, "Lee nuestros términos y condiciones para el uso del servicio.")
    |> render(:terms, layout: {OpenChatWeb.Layouts, :root})
  end

  # Nueva acción para manejar la sala de chat por estado
  def chat_room(conn, %{"state" => state}) do
    conn
    |> assign(:page_title, "#{state} Swinger Chat")
    |> assign(:meta_description, "Chat anónimo para parejas en #{state}")
    |> render(:chat_room, layout: {OpenChatWeb.Layouts, :root})
  end
end
