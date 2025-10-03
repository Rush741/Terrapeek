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

// Helper function to format population
function formatPopulation(population) {
    if (population >= 10000000) {
        return `${(population / 10000000).toFixed(1)} Crore`;
    } else if (population >= 1000000) {
        return `${(population / 1000000).toFixed(1)} Million`;
    } else if (population >= 1000) {
        return `${(population / 1000).toFixed(1)} Thousand`;
    } else {
        return population.toString();
    }
}

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
            populationFormatted: formatPopulation(content[0].population),
            region: content[0].subregion,
            continent: content[0].continents[0],
            currency: currency,
            });
    } catch (error) {
        // Check if it's a 404 error (country not found)
        if (error.response && error.response.status === 404) {
            res.render("index.ejs", {error: "Invalid country name. Please enter a valid country name."});
        } else {
            res.render("index.ejs", {error: "Invalid country name. Please enter a valid country name."});
        }
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});