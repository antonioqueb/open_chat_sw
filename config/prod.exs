import Config

# Configuración de producción
config :open_chat, OpenChatWeb.Endpoint,
  http: [port: System.get_env("PORT") || 4000],
  url: [host: "example.com", port: 443],
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  cache_static_manifest: "priv/static/cache_manifest.json"

# Configuración de Swoosh para producción
config :swoosh, api_client: Swoosh.ApiClient.Finch, finch_name: OpenChat.Finch

# Configuración de logs: nivel de logs en producción
config :logger, level: :info

# Inicializar plugs en tiempo de compilación para mejor rendimiento en producción
config :phoenix, :plug_init_mode, :compile
