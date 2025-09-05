export async function handler(event, context) {
    if (event.httpMethod === "POST") {
      try {
        const body = JSON.parse(event.body);
  
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            reply: body.answer || body.text || "Mensaje recibido 🚀",
          }),
        };
      } catch (err) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid JSON", details: err.message }),
        };
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ text: "Hola desde Netlify Functions 🚀" }),
    };
  }
  