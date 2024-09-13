import Config

# Configuración para el entorno de desarrollo:
# Deshabilitamos caché, habilitamos la recarga de código y depuración.
#
# La configuración de watchers se usa para ejecutar procesos
# externos, como esbuild y tailwind.
config :open_chat, OpenChatWeb.Endpoint,
  # Permitir acceso desde otras máquinas para desarrollo.
  http: [ip: {0, 0, 0, 0}, port: 4000],
  check_origin: false,
  code_reloader: true,  # Solo se debe habilitar en desarrollo
  debug_errors: true,
  secret_key_base: "hBaG+Jl7ti0G0yA/Hjgo1kGsQx+bWSOxas9i3ToK+1OKnlMO9SkVC65TPfLOxI6L",
  watchers: [
    esbuild: {Esbuild, :install_and_run, [:open_chat, ~w(--sourcemap=inline --watch)]},
    tailwind: {Tailwind, :install_and_run, [:open_chat, ~w(--watch)]}
  ]

# Configuración para live reload (recarga en caliente).
# Solo en desarrollo, se debe observar los cambios en archivos estáticos y plantillas.
config :open_chat, OpenChatWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/(?!uploads/).*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/open_chat_web/(controllers|live|components)/.*(ex|heex)$"
    ]
  ]

# Habilitar rutas de desarrollo para el dashboard y mailbox
config :open_chat, dev_routes: true

# Configuración de logs: no incluir metadatos ni timestamps en desarrollo
config :logger, :console, format: "[$level] $message\n"

# Mayor profundidad de stacktrace en desarrollo
config :phoenix, :stacktrace_depth, 20

# Inicializar plugs en tiempo de ejecución para una compilación más rápida en desarrollo
config :phoenix, :plug_init_mode, :runtime

# Configuración para Phoenix LiveView: habilitar anotaciones de depuración HEEx
config :phoenix_live_view,
  debug_heex_annotations: true,
  enable_expensive_runtime_checks: true  # Habilitar verificaciones costosas en desarrollo

# Deshabilitar el cliente de Swoosh en desarrollo, ya que solo se requiere en producción.
config :swoosh, :api_client, false
