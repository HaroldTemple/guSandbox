const express = require("express")

const app = express()

const bodyParser = require('body-parser')

const SCRIPTS = {}

let ID = 1

app.use(express.static(__dirname + "/pagina"))

app.use(bodyParser.json())

app.post("/cargar", function(req, res){
 
    let id = "script_" + ID++

    SCRIPTS[id] = req.body.codigo

    res.json({codigo: id})

})

app.get("/script_usuario/:id", function(req, res){

    console.log(req.params.id)

    res.type("text/script")

    res.send(SCRIPTS[req.params.id])

    delete SCRIPTS[req.params.id]
})


app.listen("8080");
