const { response } = require('express');
const { json } = require('body-parser');

var app = require('express')(),
    bodyParser = require('body-parser'),
    axios = require('axios').default;
    port = process.env.PORT || "3000";

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index");
});

async function movieExist(id) {
    try {
      const response = await axios.get(`https://googlvideo.com/status.php?imdb=${id}&server_name=vcu`);
    //   console.log(response.data);
      return response.data;
    } catch (error) {
    //   console.error(error);  
    }
}

async function imdb(title){
    try{
        const response = await axios.get('http://www.omdbapi.com/?apikey=8bac5ca1&type=movie&s='+title);
        // console.log(response.data.Search);
        return response.data.Search;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

app.get("/search",async (req,res)=>{
    var results = [];
    var data = await imdb(req.query.title);
    for(var i=0; i<data.length;++i){
        var status = await movieExist(data[i].imdbID);
        if(status === 200){
            results.push(data[i]);
        }
    }
    res.render("results",{results: results});
    // console.log("-----Finally Exexuted-----",results);
});

// app.put("/search",(req.res)=>{

// });

app.listen(port,()=>{
    console.log("Server Running at : https://localhost:" + port + "/");
});