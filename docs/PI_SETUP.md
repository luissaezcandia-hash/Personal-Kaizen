# Configuración de Pi Coding Agent

Este documento detalla el proceso para instalar y configurar **Pi Coding Agent**, un agente de codificación autónomo que puede operar localmente utilizando Ollama.

## Requisitos Previos

- **Node.js**: Versión 20.0 o superior.
- **Ollama**: Instalado y ejecutándose en segundo plano si se desea usar modelos locales.

## Pasos de Instalación

### 1. Instalar el CLI globalmente
Ejecuta el siguiente comando en tu terminal para instalar el agente Pi a través de NPM:

```bash
npm install -g @earendil-works/pi-coding-agent
```

> **Nota**: El paquete fue migrado recientemente de `@mariozechner/pi-coding-agent` a `@earendil-works/pi-coding-agent`.

### 2. Configurar el motor de IA (Ollama Local)
Para operar de forma independiente sin enviar código a servicios externos, puedes conectar Pi directamente a Ollama.

#### Paso A: Crear archivo de modelos
Pi requiere un archivo de configuración para reconocer los modelos locales. Crea el archivo `~/.pi/agent/models.json` (en Windows: `%USERPROFILE%\.pi\agent\models.json`) con el siguiente contenido:

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false
      },
      "models": [
        { "id": "llama3.2:latest" },
        { "id": "qwen2.5-coder:latest" },
        { "id": "mistral:latest" }
      ]
    }
  }
}
```

#### Paso B: Iniciar el agente
1. Asegúrate de tener **Ollama** corriendo con un modelo activo.
2. Inicia el agente en la terminal de tu proyecto apuntando al proveedor configurado:

```bash
pi --provider ollama --model llama3.2:latest
```

*Si prefieres usar modelos en la nube como Claude o GPT, ejecuta `pi /login` o configura las variables de entorno correspondientes.*

### 3. Vincular con VS Code
Puedes usar el agente directamente desde la interfaz de VS Code:

1. Abre la paleta de comandos (`Ctrl+P` o `Cmd+P`).
2. Ejecuta: `ext install tintinweb.vscode-pi-model-chat-provider`
3. Abre el panel de Chat del editor. Los modelos configurados en Pi aparecerán ahora en el selector de IA nativo.

---
*Este documento es parte del sistema de documentación técnica de Personal Kaizen.*
