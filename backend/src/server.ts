import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Express REST API active at http://localhost:${PORT}`);
  console.log(`[ENVIRONMENT] Mode: ${process.env.NODE_ENV || "development"}`);
});
