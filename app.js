const { response } = require('express');
const { json } = require('body-parser');

var app = require('express')(),
    bodyParser = require('body-parser'),
    axios = require('axios').default,
    sanitizeHTML = require('sanitize-html');
    port = process.env.PORT || "3000",
    ip = process.env.IP;// || "172.27.157.164";

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.render("index");
});

async function movieExist(id) {
    try {
      const response = await axios.get(`https://googlvideo.com/status.php?imdb=${id}&server_name=vcu`);
      return response.data;
    } catch (error) {
      return 404; 
    }
}

async function imdb(title){
    try{
        const response = await axios.get('http://www.omdbapi.com/?apikey='+process.env.OMDBKEY+'&type=movie&s='+title);
        return response.data.Search;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function movieData(id){
    var movie = await (await axios.get('http://www.omdbapi.com/?apikey='+process.env.OMDBKEY+'&i='+id)).data;
    movie.Res = `https://googlvideo.com/jadeed.php?imdb=${movie.imdbID}&server_name=vcu`
    return movie;
}

app.get("/search",async (req,res)=>{
    var results = [];
    var title = sanitizeHTML(req.query.title);
    var data = await imdb(title) || 0;
    for(var i=0; i<data.length;++i){
        var status = await movieExist(data[i].imdbID);
        if(status === 200){
            results.push(data[i]);
        }
    }
    res.render("results",{results: results});
});

app.get("/watch",async (req,res)=>{
    var id = sanitizeHTML(req.query.id);
    var movie = await movieData(id);
    // console.log(movie);
    res.render("watch",{movie:movie});
});

app.listen(port,ip,()=>{
    console.log("Server Running at :"+ip+":"+ + port + "/");
});