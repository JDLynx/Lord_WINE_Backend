import { Router } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid';
import colors from 'colors';
import Producto from '../models/producto';
import Categoria from '../models/categoria';
import TiendaFisica from '../models/tienda_fisica';

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

        let finalResponseText = '';

        const intentName = result.intent?.displayName;
        const productName = result.parameters?.fields?.producto?.stringValue || result.parameters?.fields?.Producto?.stringValue;
        const categoryName = result.parameters?.fields?.Tipoproducto?.stringValue;

        // Lógica para el intent de precio
        if (intentName === 'ConsultarPrecioProducto') {
            if (productName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el precio de: "${productName}"`));
                try {
                    const product = await Producto.findOne({ where: { prodNombre: productName } });
                    if (product) {
                        finalResponseText = `El precio de ${product.prodNombre} es de $${product.prodPrecio.toLocaleString("es-CO")}.`;
                    } else {
                        finalResponseText = 'Lo siento, no pude encontrar información sobre ese producto.';
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos. Por favor, inténtelo de nuevo más tarde.';
                }
            } else {
                finalResponseText = 'No entendí el producto que buscas. Por favor, sé más específico.';
            }
        }
        
        // Lógica para el intent de descripción
        else if (intentName === 'ConsultarDescripcionProducto') {
            if (productName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la descripción de: "${productName}"`));
                try {
                    const product = await Producto.findOne({ where: { prodNombre: productName } });
                    if (product) {
                        finalResponseText = `Claro, aquí está la descripción de ${product.prodNombre}: "${product.prodDescripcion}".`;
                    } else {
                        finalResponseText = 'Lo siento, no pude encontrar información sobre ese producto.';
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos. Por favor, inténtelo de nuevo más tarde.';
                }
            } else {
                finalResponseText = 'No entendí el producto que buscas. Por favor, sé más específico.';
            }
        }
        
        // Lógica para el intent de productos por categoría
        else if (intentName === 'ConsultarProductosPorCategoria') {
            if (categoryName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la categoría: "${categoryName}"`));
                try {
                    const foundCategory = await Categoria.findOne({
                        where: { catNombre: categoryName },
                        include: [Producto]
                    });
                    if (foundCategory && foundCategory.productos.length > 0) {
                        const productList = foundCategory.productos.map(p => p.prodNombre).join(', ');
                        finalResponseText = `En la categoría "${foundCategory.catNombre}" tenemos los siguientes productos: ${productList}.`;
                    } else if (foundCategory) {
                        finalResponseText = `Lo siento, la categoría "${foundCategory.catNombre}" no tiene productos registrados.`;
                    } else {
                        finalResponseText = `Lo siento, no pude encontrar la categoría "${categoryName}".`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos.';
                }
            } else {
                finalResponseText = 'No entendí la categoría que buscas.';
            }
        }
        
        // Lógica para el intent de conteo
        else if (intentName === 'ConsultarConteoProductosPorCategoria') {
            if (categoryName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el conteo en la categoría: "${categoryName}"`));
                try {
                    const foundCategory = await Categoria.findOne({
                        where: { catNombre: categoryName },
                        include: [Producto]
                    });
                    if (foundCategory) {
                        const productCount = foundCategory.productos.length;
                        if (productCount > 0) {
                            finalResponseText = `En la categoría "${foundCategory.catNombre}" tenemos ${productCount} productos.`;
                        } else {
                            finalResponseText = `Lo siento, la categoría "${foundCategory.catNombre}" no tiene productos registrados.`;
                        }
                    } else {
                        finalResponseText = `Lo siento, no pude encontrar la categoría "${categoryName}".`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos.';
                }
            } else {
                finalResponseText = 'No entendí la categoría que buscas.';
            }
        }
        
        // Lógica para el intent ConsultarCategoriaDeProducto
        else if (intentName === 'ConsultarCategoriaDeProducto') {
            if (productName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la categoría de: "${productName}"`));
                try {
                    const product = await Producto.findOne({
                        where: { prodNombre: productName },
                        include: [Categoria]
                    });
                    if (product && product.categoria) {
                        finalResponseText = `El producto "${product.prodNombre}" pertenece a la categoría de "${product.categoria.catNombre}".`;
                    } else if (product) {
                        finalResponseText = `Lo siento, no se pudo encontrar la categoría para el producto "${productName}".`;
                    } else {
                        finalResponseText = `Lo siento, no pude encontrar el producto "${productName}".`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos.';
                }
            } else {
                finalResponseText = 'No entendí el producto del que quieres saber la categoría.';
            }
        }
        
        // Lógica para el intent ConsultarCategoriasDisponibles
        else if (intentName === 'ConsultarCategoriasDisponibles') {
            console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para listar todas las categorías.`));
            try {
                const categories = await Categoria.findAll({ attributes: ['catNombre'] });
                
                if (categories.length > 0) {
                    const categoryList = categories.map(c => c.catNombre).join(', ');
                    finalResponseText = `Actualmente tenemos las siguientes categorías: ${categoryList}.`;
                } else {
                    finalResponseText = 'Lo siento, no hay categorías de productos disponibles.';
                }
            } catch (dbError) {
                console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                finalResponseText = 'Hubo un error al consultar la base de datos.';
            }
        }
        
        // Lógica para el intent ConsultarTiendasDisponibles
        else if (intentName === 'ConsultarTiendasDisponibles') {
            console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para listar todas las tiendas.`));
            try {
                const tiendas = await TiendaFisica.findAll({ attributes: ['tiendNombre', 'tiendDireccion', 'tiendTelefono'] });
                if (tiendas.length > 0) {
                    let responseList = 'Nuestras tiendas son:';
                    tiendas.forEach(tienda => {
                        responseList += `\n- ${tienda.tiendNombre} en ${tienda.tiendDireccion}. Teléfono: ${tienda.tiendTelefono}.`;
                    });
                    finalResponseText = responseList;
                } else {
                    finalResponseText = 'Lo siento, no hay tiendas físicas disponibles en este momento.';
                }
            } catch (dbError) {
                console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                finalResponseText = 'Hubo un error al consultar la base de datos.';
            }
        }

        // Lógica para el intent ConsultarUbicacionTienda
        else if (intentName === 'ConsultarUbicacionTienda') {
            const storeName = result.parameters?.fields?.NombreTienda?.stringValue;
            if (storeName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la ubicación de: "${storeName}"`));
                try {
                    const store = await TiendaFisica.findOne({
                        where: { tiendNombre: storeName }
                    });
                    if (store) {
                        finalResponseText = `La tienda "${store.tiendNombre}" se encuentra en la dirección: ${store.tiendDireccion}.`;
                    } else {
                        finalResponseText = `Lo siento, no pude encontrar la tienda "${storeName}".`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos.';
                }
            } else {
                finalResponseText = 'No entendí de qué tienda quieres saber la ubicación. Por favor, sé más específico.';
            }
        }

        // Lógica para el intent ConsultarTelefonoTienda
        else if (intentName === 'ConsultarTelefonoTienda') {
            const storeName = result.parameters?.fields?.NombreTienda?.stringValue;

            if (storeName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el teléfono de: "${storeName}"`));
                try {
                    const store = await TiendaFisica.findOne({
                        where: { tiendNombre: storeName }
                    });

                    if (store) {
                        finalResponseText = `El número de teléfono de la tienda "${store.tiendNombre}" es: ${store.tiendTelefono}.`;
                    } else {
                        finalResponseText = `Lo siento, no pude encontrar la tienda "${storeName}". ¿Podrías intentar con otra?`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos. Por favor, inténtelo de nuevo más tarde.';
                }
            } else {
                finalResponseText = 'No entendí de qué tienda quieres saber el teléfono. Por favor, sé más específico.';
            }
        }
        
        else {
            finalResponseText = result.fulfillmentText || 'Lo siento, no pude procesar tu solicitud.';
        }

        res.json({
            reply: finalResponseText,
            intentName: intentName,
            parameters: result.parameters?.fields,
        });

    } catch (error) {
        console.error(colors.red.bold('[Dialogflow ERROR general en detectIntent]:'), error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al comunicarse con Dialogflow.';
        res.status(500).json({ error: `Error en el asistente virtual: ${errorMessage}` });
    }
});

export default router;