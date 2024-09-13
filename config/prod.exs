import Config

config :open_chat, OpenChatWeb.Endpoint,
  cache_static_manifest: "priv/static/cache_manifest.json",
  server: true,
  root: ".",
  version: Application.spec(:open_chat, :vsn)

config :swoosh, api_client: Swoosh.ApiClient.Finch, finch_name: OpenChat.Finch

config :swoosh, local: false

config :logger, level: :info
