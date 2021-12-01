const express = require("express");
const bodyParser = require('body-parser')
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

const limit = 3;

app.get("/", (req, res)=>{
    axios
    .get("http://localhost:3000/load")
    .then((load1) => {
        // console.log(load1);
        if(load1.data.load <limit){
            return res.redirect("http://localhost:3000")
        }
        else{
            axios
            .get("http://localhost:3001/load")
            .then((load2) => {
                if(load2.data.load <limit){
                    return res.redirect("http://localhost:3001")
                }
                else{
                    return res.send("Too much load");
                }
            })
        }
    })
});

app.listen(8000, ()=>{
    console.log("Load balancer running.");
})