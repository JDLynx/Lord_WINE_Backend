import { Router } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid';
import colors from 'colors';


const router = Router();

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

if (!projectId) {
  console.error(colors.red.bold("ERROR: La variable de entorno GOOGLE_CLOUD_PROJECT_ID no está configurada en tu .env."));
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
        languageCode: 'es',
      },
    },
  };

  try {
    console.log(colors.blue(`[Dialogflow] Mensaje entrante de ${currentUserId} (Sesión: ${sessionId}): "${message}"`));

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0]?.queryResult;

    if (!result) {
        console.error(colors.red(`[Dialogflow ERROR]: No se recibió un queryResult válido de Dialogflow para el mensaje: "${message}"`));
        return res.status(500).json({ error: 'No se pudo obtener una respuesta válida del asistente virtual.' });
    }

    console.log(colors.green(`[Dialogflow] Respuesta del agente: "${result.fulfillmentText}"`));
    if (result.intent) {
      console.log(colors.yellow(`[Dialogflow] Intento detectado: ${result.intent.displayName}`));
    }
    if (result.parameters && Object.keys(result.parameters.fields || {}).length > 0) {
      console.log(colors.magenta(`[Dialogflow] Parámetros: ${JSON.stringify(result.parameters.fields)}`));
    }


    // Envía la respuesta de Dialogflow de vuelta al frontend
    res.json({
      reply: result.fulfillmentText,
      intentName: result.intent?.displayName,
      parameters: result.parameters?.fields,
    });

  } catch (error) {
    console.error(colors.red.bold('[Dialogflow ERROR general en detectIntent]:'), error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al comunicarse con Dialogflow.';
    res.status(500).json({ error: `Error en el asistente virtual: ${errorMessage}` });
  }
});

export default router;