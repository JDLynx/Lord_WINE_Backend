import { Router } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid';
import colors from 'colors';
import Producto from '../models/producto';

const router = Router();

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

if (!projectId) {
    console.error(colors.red.bold("ERROR: La variable de entorno GOOGLE_CLOUD_PROJECT_ID no está configurada en tu .env."));
}

const sessionClient = new SessionsClient();
const sessionIds: Map<string, string> = new Map();

function getSessionId(userId: string): string {
    if (!sessionIds.has(userId)) {
        sessionIds.set(userId, uuid());
    }
    return sessionIds.get(userId)!;
}

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

        let finalResponseText = result.fulfillmentText;

        // LÓGICA CLAVE: Manejar el intento "ConsultarPrecioProducto"
        if (result.intent?.displayName === 'ConsultarPrecioProducto') {
            const productName = result.parameters?.fields?.Producto?.stringValue;

            if (productName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el producto: "${productName}"`));
                try {
                    // Consulta el modelo de Sequelize usando la propiedad
                    const product = await Producto.findOne({ where: { prodNombre: productName } });

                    if (product) {
                        // Si se encuentra el producto, usa sus propiedades
                        finalResponseText = `El precio de ${product.prodNombre} es de $${product.prodPrecio.toLocaleString("es-CO")}.`;
                    } else {
                        // Si no se encuentra el producto
                        finalResponseText = `Lo siento, no pude encontrar información sobre el producto "${productName}".`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos. Por favor, inténtelo de nuevo más tarde.';
                }
            } else {
                finalResponseText = 'No entendí el producto que estás buscando. Por favor, sé más específico.';
            }
        }

        res.json({
            reply: finalResponseText,
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