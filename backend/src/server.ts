import app from ".";
import { config } from "dotenv";
config();

const port: Number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
