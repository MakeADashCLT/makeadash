require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5002

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});