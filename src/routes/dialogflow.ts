import { Router } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid';
import colors from 'colors';
import { Op } from 'sequelize';

// Importa tus modelos
import Producto from '../models/producto';
import Categoria from '../models/categoria';
import TiendaFisica from '../models/tienda_fisica';
import TieneInventarioTiendaProducto from '../models/tiene_inventario_tienda_producto';
import { InventarioTienda } from '../models/inventario_tienda';

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

        let finalResponseText = result.fulfillmentText || 'Lo siento, no pude procesar tu solicitud.';
        let quickReplies = null;
        const intentName = result.intent?.displayName;
        const productName = result.parameters?.fields?.Producto?.stringValue || '';
        const categoryName = result.parameters?.fields?.Tipoproducto?.stringValue || '';
        const storeName = result.parameters?.fields?.NombreTienda?.stringValue || '';
        
        // Lógica de fulfillment para cada intent
        
        // Intent: ConsultarPrecioProducto
        if (intentName === 'ConsultarPrecioProducto') {
            const producto = result.parameters?.fields?.producto?.stringValue || productName;
            if (producto) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el precio de: "${producto}"`));
                try {
                    const foundProduct = await Producto.findOne({ where: { prodNombre: { [Op.like]: `%${producto}%` } } });
                    if (foundProduct) {
                        finalResponseText = `El precio de ${foundProduct.prodNombre} es de $${foundProduct.prodPrecio.toLocaleString("es-CO")}.`;
                    } else {
                        finalResponseText = 'Lo siento, no pude encontrar información sobre ese producto.';
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos. Por favor, inténtelo de nuevo más tarde.';
                }
            } else {
                finalResponseText = result.fulfillmentText || '¿De qué producto te gustaría saber el precio?';
            }
        }
        
        // Intent: ConsultarDescripcionProducto
        else if (intentName === 'ConsultarDescripcionProducto') {
            const producto = result.parameters?.fields?.producto?.stringValue || productName;
            if (producto) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la descripción de: "${producto}"`));
                try {
                    const foundProduct = await Producto.findOne({ where: { prodNombre: { [Op.like]: `%${producto}%` } } });
                    if (foundProduct) {
                        finalResponseText = `Claro, aquí está la descripción de ${foundProduct.prodNombre}: "${foundProduct.prodDescripcion}".`;
                        quickReplies = null; // Eliminado
                    } else {
                        finalResponseText = 'Lo siento, no pude encontrar información sobre ese producto.';
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos. Por favor, inténtelo de nuevo más tarde.';
                }
            } else {
                finalResponseText = result.fulfillmentText || 'Por favor, dime el nombre del producto que buscas.';
            }
        }
        
        else if (intentName === 'ConsultarProductosPorCategoria') {
            if (categoryName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la categoría: "${categoryName}"`));
                try {
                    const foundCategory = await Categoria.findOne({
                        where: { catNombre: { [Op.like]: `%${categoryName}%` } },
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
                finalResponseText = result.fulfillmentText || '¿De qué categoría te gustaría conocer los productos?';
            }
        }
        
        // Intent: ConsultarConteoProductosPorCategoria
        else if (intentName === 'ConsultarConteoProductosPorCategoria') {
            if (categoryName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el conteo en la categoría: "${categoryName}"`));
                try {
                    const foundCategory = await Categoria.findOne({
                        where: { catNombre: { [Op.like]: `%${categoryName}%` } },
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
                finalResponseText = result.fulfillmentText || '¿De qué categoría te gustaría saber el número de productos?';
            }
        }
        
        // Intent: ConsultarCategoriaDeProducto
        else if (intentName === 'ConsultarCategoriaDeProducto') {
            const producto = result.parameters?.fields?.producto?.stringValue || productName;
            if (producto) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la categoría de: "${producto}"`));
                try {
                    const foundProduct = await Producto.findOne({
                        where: { prodNombre: { [Op.like]: `%${producto}%` } },
                        include: [Categoria]
                    });
                    if (foundProduct && foundProduct.categoria) {
                        finalResponseText = `El producto "${foundProduct.prodNombre}" pertenece a la categoría de "${foundProduct.categoria.catNombre}".`;
                    } else if (foundProduct) {
                        finalResponseText = `Lo siento, no se pudo encontrar la categoría para el producto "${producto}".`;
                    } else {
                        finalResponseText = `Lo siento, no pude encontrar el producto "${producto}".`;
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos.';
                }
            } else {
                finalResponseText = result.fulfillmentText || '¿De qué producto quieres saber la categoría?';
            }
        }
        
        // Intent: ConsultarCategoriasDisponibles
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
        
        // Intent: ConsultarTiendasDisponibles
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
                    quickReplies = ["Consultar ubicación", "Consultar teléfono"];
                } else {
                    finalResponseText = 'Lo siento, no hay tiendas físicas disponibles en este momento.';
                }
            } catch (dbError) {
                console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                finalResponseText = 'Hubo un error al consultar la base de datos.';
            }
        }
        
        // Intent: ConsultarUbicacionTienda
        else if (intentName === 'ConsultarUbicacionTienda') {
            if (storeName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la ubicación de: "${storeName}"`));
                try {
                    const store = await TiendaFisica.findOne({
                        where: { tiendNombre: { [Op.like]: `%${storeName}%` } }
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
                finalResponseText = result.fulfillmentText || '¿De qué tienda quieres saber la ubicación?';
            }
        }
        
        // Intent: ConsultarTelefonoTienda
        else if (intentName === 'ConsultarTelefonoTienda') {
            if (storeName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para el teléfono de: "${storeName}"`));
                try {
                    const store = await TiendaFisica.findOne({
                        where: { tiendNombre: { [Op.like]: `%${storeName}%` } }
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
                finalResponseText = result.fulfillmentText || '¿De qué tienda quieres saber el teléfono?';
            }
        }
        
        // Intent: ConsultarDisponibilidadProducto
        else if (intentName === 'ConsultarDisponibilidadProducto') {
            if (productName) {
                console.log(colors.yellow(`[Fulfillment] Consultado la base de datos para la disponibilidad de: "${productName}"`));
                try {
                    const producto = await Producto.findOne({
                        where: { prodNombre: { [Op.like]: `%${productName}%` } },
                        include: [{
                            model: TieneInventarioTiendaProducto,
                            include: [{
                                model: InventarioTienda,
                                include: [TiendaFisica]
                            }]
                        }]
                    });
        
                    if (!producto) {
                        finalResponseText = `Lo siento, no pude encontrar el producto "${productName}". ¿Podrías intentar con otra cosa?`;
                    } else {
                        const inventarios = producto.inventarioPorTienda;
        
                        if (inventarios.length === 0) {
                            finalResponseText = `Actualmente no tenemos información de stock para el producto "${producto.prodNombre}".`;
                        } else {
                            let respuesta = `La disponibilidad de "${producto.prodNombre}" es la siguiente:\n`;
                            let tiendasConProducto: string[] = [];
        
                            for (const inv of inventarios) {
                                const cantidad = inv.invTienProdCantidad;
                                const inventarioTiendaInstance = inv.inventarioTienda;
                                const tiendasFisicas = inventarioTiendaInstance.tiendasFisicas;
                                const tienda = tiendasFisicas?.[0]?.tiendNombre || 'Tienda desconocida';
        
                                if (cantidad > 0) {
                                    respuesta += `En la tienda de ${tienda} hay ${cantidad} unidad(es) disponible(s).\n`;
                                    tiendasConProducto.push(tienda);
                                } else {
                                    respuesta += `El producto está agotado en la tienda de ${tienda}.\n`;
                                }
                            }
                            finalResponseText = respuesta;
                            quickReplies = null; // Eliminado
                        }
                    }
                } catch (dbError) {
                    console.error(colors.red.bold('[Base de datos ERROR]:'), dbError);
                    finalResponseText = 'Hubo un error al consultar la base de datos.';
                }
            } else {
                finalResponseText = result.fulfillmentText || '¿De qué producto quieres saber la disponibilidad?';
            }
        }
        
        if (!finalResponseText) {
            finalResponseText = result.fulfillmentText || 'Lo siento, no pude procesar tu solicitud. ¿Podrías reformular tu pregunta?';
        }

        res.json({
            reply: finalResponseText,
            intentName: intentName,
            parameters: result.parameters?.fields,
            quickReplies: quickReplies,
        });

    } catch (error) {
        console.error(colors.red.bold('[Dialogflow ERROR general en detectIntent]:'), error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al comunicarse con Dialogflow.';
        res.status(500).json({ error: `Error en el asistente virtual: ${errorMessage}` });
    }
});

export default router;