# Usa la imagen oficial de Elixir
FROM elixir:1.14-alpine

# Instala las dependencias del sistema
RUN apk add --no-cache bash openssl git

# Configura el entorno de trabajo
WORKDIR /app

# Instala las dependencias de Elixir y Phoenix
RUN mix local.hex --force && \
    mix local.rebar --force

# Copia el archivo mix.exs y el mix.lock para instalar dependencias
COPY mix.exs ./ 

# Instala las dependencias
RUN mix deps.get
RUN apk add --no-cache inotify-tools


# Copia el resto del código de la aplicación
COPY . .

# Compila la aplicación
RUN mix compile

# Expone el puerto de Phoenix
EXPOSE 4000

# Comando para iniciar Phoenix
CMD ["mix", "phx.server"]
