defmodule OpenChatWeb.PageController do
  use OpenChatWeb, :controller

  def home(conn, _params) do
    # Renderizar con layout y pasar variables de SEO dinámico
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
end
