const { response } = require('express');
const { json } = require('body-parser');

var app = require('express')(),
    bodyParser = require('body-parser'),
    got = require('got'),
    port = process.env.PORT || "3000";

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/search",(req,res)=>{
    (async () => {
        try {
            const response = await got('http://www.omdbapi.com/?apikey=8bac5ca1&s='+req.query.title);
            var data = JSON.parse(response.body);
            // console.log(data);
            // res.send(data);
            res.render("results",{results: data.Search});
            //=> '<!doctype html> ...'
        } catch (error) {
            console.log(error.response.body);
            res.redirect("/");
            //=> 'Internal server error ...'
        }
    })();
});

app.listen(port,()=>{
    console.log("Server Running at : https://localhost:" + port + "/");
});