import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor no ar");
});

// Rota para listar detalhes do produto na Printify (inclui variants)
app.get("/printify-product", async (req, res) => {
  try {
    const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
    const STORE_ID = process.env.PRINTIFY_STORE_ID || "1159";
    const PRODUCT_ID = process.env.PRINTIFY_PRODUCT_ID || "105";

    if (!PRINTIFY_API_KEY) {
      return res.status(500).send("PRINTIFY_API_KEY não configurada");
    }

    const response = await fetch(
      `https://api.printify.com/v1/shops/${STORE_ID}/products/${PRODUCT_ID}.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_KEY}`
        }
      }
    );

    const data = await response.json();
    console.log("Produto Printify:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Erro da Printify: ${JSON.stringify(data)}`);
    }

    // devolve o JSON completo para você ver no navegador / ReqBin
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar produto na Printify:", err);
    res.status(500).send("Erro interno ao buscar produto na Printify");
  }
});

// Mantém o webhook simples por enquanto
app.post("/webhook", (req, res) => {
  console.log("Recebi algo em /webhook");
  console.log("Body recebido:", JSON.stringify(req.body, null, 2));
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
