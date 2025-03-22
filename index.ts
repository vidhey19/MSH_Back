import app from "./src/app";

// Define port
const PORT: number = Number(process.env.PORT) || 5000;

// Start Express server
app.listen(PORT, () => {
  console.log(`⚡ Server running at http://localhost:${PORT}`);
});
