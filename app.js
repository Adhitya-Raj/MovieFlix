var app = require('express')(),
    port = process.env.PORT || "3000",
    ip = process.env.IP || "172.27.154.145";

app.get("/",(req,res)=>{
    res.send("App is working!");
});

app.listen(port,ip,()=>{
    console.log("Server Running at : " + ip + ":" + port + "/");
});