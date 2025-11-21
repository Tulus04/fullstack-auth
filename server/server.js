const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoute = require("./routes/authRoute");
const itemRoute = require("./routes/itemRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/items", itemRoute);

const PORT = 3000;

sequelize.authenticate()
    .then(() => {
        console.log("Database tersambung");
        app.listen(PORT, () => {
            console.log(`Server berjalan di port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database tidak tersambung:', err);
    });
