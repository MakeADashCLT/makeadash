require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 50002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});