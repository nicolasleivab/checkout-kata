import app from "./app.js";
import { PORT } from "./config";

app.listen(PORT, () => {
  console.log(`API   ready at http://localhost:${PORT}`);
});
