import { createServer } from "./server.ts";

const PORT = Number(process.env.PORT ?? 3000);
createServer().listen(PORT, () => {
  console.log(`PetroOps API listening on http://localhost:${PORT}`);
});
