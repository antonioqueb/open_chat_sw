# lib\open_chat\chat_storage.ex
defmodule OpenChat.ChatStorage do
  @moduledoc """
  Manejo de almacenamiento temporal de chats.
  """

  @chat_dir "chats/"

  # Guardar mensaje en un archivo de texto
  def save_message(state, user, message) do
    File.mkdir_p(@chat_dir)
    file_path = Path.join(@chat_dir, "#{state}.txt")
    File.write(file_path, "#{user}: #{message}\n", [:append])
  end

  # Limpiar chats antiguos (mayores a 24 horas)
  def clean_old_chats do
    File.ls!(@chat_dir)
    |> Enum.each(fn file ->
      file_path = Path.join(@chat_dir, file)
      {:ok, info} = File.stat(file_path)

      # Borrar archivos modificados hace más de 24 horas
      if info.mtime < :calendar.universal_time() |> :calendar.time_difference(86400) do
        File.rm(file_path)
      end
    end)
  end
end
