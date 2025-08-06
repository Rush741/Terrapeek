import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
const API_URL = "https://restcountries.com/v3.1";

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/country", async (req, res) => {
    console.log(req.body);
    try {
        const response = await axios.get(`${API_URL}/name/${req.body.country}?fullText=true`);
        var content = (response.data);

        const currencies = content[0].currencies;
        const currencyCodes = Object.keys(currencies)[0];
        var currency = currencies[currencyCodes].name;
        
        res.render("index.ejs", {
            flag: content[0].flags.png,
            capital: content[0].capital[0],
            population: content[0].population,
            region: content[0].subregion,
            continent: content[0].continents[0],
            currency: currency,
            });
    } catch (error) {
        res.render("index.ejs", {error: JSON.stringify(error.response.data || error.message)});
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});