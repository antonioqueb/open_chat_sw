defmodule OpenChat.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    # Iniciar la tabla ETS para usuarios activos
    :ets.new(:chat_active_users, [:set, :public, :named_table])

    children = [
      OpenChatWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:open_chat, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: OpenChat.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: OpenChat.Finch},
      # Agregar el Quantum Scheduler
      OpenChat.Scheduler,  # <-- Aquí agregamos el scheduler de Quantum
      # Start to serve requests, typically the last entry
      OpenChatWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: OpenChat.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    OpenChatWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
