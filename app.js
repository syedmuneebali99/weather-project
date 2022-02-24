const https = require("https");
// const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const info = require("./secret");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res, next) {
  const cityName = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${info.appid}&units=metric`;

  https.get(url, (response) => {
    console.log("status code : " + response.statusCode);

    if (response.statusCode === 404) {
      console.warn("city not found.");
      return res.send("city not found!");
    }

    response.on("data", function (data) {
      //"data" will give us hold on data whaterver we get through requesting external server
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
      const temp = `<h1>Temprature in ${cityName} : ${weatherData.main.temp} C</h1>`;
      const weatherDesc = `<h4>Weather Description in ${cityName} : <b><u>${weatherData.weather[0].description}</u></b></h4>`;
      const icon = weatherData.weather[0].icon;
      const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(temp);
      res.write(weatherDesc);
      res.write(`<img src = "${imageUrl}">`);
      res.send();
    });
  });
});

app.listen(port, () => {
  console.log("listening at port = " + port);
});
