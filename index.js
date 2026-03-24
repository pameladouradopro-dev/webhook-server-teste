import express from "express";

const app = express();

// Middleware para tentar parsear JSON e capturar erro
app.use(express.json());

// Tratamento de erro de JSON inválido
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.error("JSON inválido:", err.message);
    return res.status(400).send("JSON inválido");
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Servidor no ar");
});

app.post("/webhook", (req, res) => {
  console.log("Recebi algo em /webhook");
  console.log("Body recebido:", JSON.stringify(req.body, null, 2));
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
