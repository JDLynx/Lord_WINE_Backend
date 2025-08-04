// src/routes/dialogflow.ts
import { Router } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid'; // Para generar IDs de sesión únicos
import colors from 'colors'; // Importar colors para logs (ya lo tienes en otros archivos, buena práctica aquí también)


const router = Router();

// Lee el Project ID desde las variables de entorno.
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

// Verifica si el projectId está definido. Si no, lanza un error para depuración temprana.
if (!projectId) {
  console.error(colors.red.bold("ERROR: La variable de entorno GOOGLE_CLOUD_PROJECT_ID no está configurada en tu .env."));
  // Puedes elegir salir de la aplicación o manejar este error de forma más elegante en producción
  // process.exit(1);
}

// Crea un nuevo cliente de sesión para Dialogflow.
const sessionClient = new SessionsClient();

// Map para almacenar IDs de sesión por usuario (simple para demostración)
const sessionIds: Map<string, string> = new Map();

// Función auxiliar para obtener o crear un ID de sesión para un usuario.
function getSessionId(userId: string): string {
  if (!sessionIds.has(userId)) {
    sessionIds.set(userId, uuid());
  }
  return sessionIds.get(userId)!;
}

// Define la ruta POST para interactuar con Dialogflow
router.post('/dialogflow-query', async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El campo "message" es requerido en el cuerpo de la solicitud.' });
  }

  const currentUserId = userId || 'default-frontend-user';
  const sessionId = getSessionId(currentUserId);

  const sessionPath = sessionClient.projectAgentSessionPath(projectId!, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'es', // ¡IMPORTANTE! Asegúrate de que este código de idioma coincida con el de tu agente
      },
    },
  };

  try {
    console.log(colors.blue(`[Dialogflow] Mensaje entrante de ${currentUserId} (Sesión: ${sessionId}): "${message}"`));

    const responses = await sessionClient.detectIntent(request);
    // Solución al error TS18049: Comprobamos si queryResult existe
    const result = responses[0]?.queryResult;

    if (!result) {
        console.error(colors.red(`[Dialogflow ERROR]: No se recibió un queryResult válido de Dialogflow para el mensaje: "${message}"`));
        return res.status(500).json({ error: 'No se pudo obtener una respuesta válida del asistente virtual.' });
    }

    console.log(colors.green(`[Dialogflow] Respuesta del agente: "${result.fulfillmentText}"`));
    // Opcional: Loguear el intento detectado y los parámetros para depuración
    if (result.intent) {
      console.log(colors.yellow(`[Dialogflow] Intento detectado: ${result.intent.displayName}`));
    }
    if (result.parameters && Object.keys(result.parameters.fields || {}).length > 0) { // Añadir || {} para seguridad
      console.log(colors.magenta(`[Dialogflow] Parámetros: ${JSON.stringify(result.parameters.fields)}`));
    }


    // Envía la respuesta de Dialogflow de vuelta al frontend
    res.json({
      reply: result.fulfillmentText, // El texto de respuesta del agente
      intentName: result.intent?.displayName, // Usar encadenamiento opcional para propiedades anidadas
      parameters: result.parameters?.fields,
      // fulfillmentMessages: result.fulfillmentMessages, // Descomentar si tu frontend los necesita
      // diagnosticInfo: result.diagnosticInfo // Útil para depuración
    });

  } catch (error) {
    console.error(colors.red.bold('[Dialogflow ERROR general en detectIntent]:'), error);
    // Manejo de errores: Envía un mensaje de error genérico al frontend
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al comunicarse con Dialogflow.';
    res.status(500).json({ error: `Error en el asistente virtual: ${errorMessage}` });
  }
});

export default router;