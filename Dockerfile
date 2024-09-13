# Usa la imagen oficial de Elixir
FROM elixir:1.14-alpine

# Instala las dependencias del sistema
RUN apk add --no-cache bash openssl git build-base npm

# Configura el entorno de trabajo
WORKDIR /app

# Instala las dependencias de Elixir y Phoenix
RUN mix local.hex --force && \
    mix local.rebar --force

# Copia el archivo mix.exs para instalar las dependencias
COPY mix.exs ./

# Instala las dependencias de Elixir (esto generará el mix.lock automáticamente)
RUN mix deps.get

# Cambia a la carpeta de assets y copia los archivos de configuración de NPM
WORKDIR /app/assets
COPY assets/package.json assets/package-lock.json ./

# Instala las dependencias de NPM dentro de la carpeta assets
RUN npm install

# Regresa al directorio de trabajo principal y copia el resto del código
WORKDIR /app
COPY . .

# Genera y digiere los assets estáticos dentro de la carpeta assets
RUN npm run deploy --prefix ./assets && \
    mix phx.digest

# Compila la aplicación
RUN mix compile

# Expone el puerto de Phoenix
EXPOSE 4000

# Comando para iniciar Phoenix
CMD ["mix", "phx.server"]
