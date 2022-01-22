require("dotenv").config();
const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const unit = req.body.weatherUnit;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const city = weatherData.name;
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write(
        "<h1>The current temperature in " + city + " is " + temp + "°C</h1>"
      );
      res.write("<p>the weather condition is " + description + "</p>");
      res.write("<img src=" + imgURL + ">");
      res.send();
    });
  });
});

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
