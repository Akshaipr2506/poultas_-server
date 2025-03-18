require('dotenv').config()

const express = require('express')

const cors = require('cors')

const server=express()

const router=require('./router')
require('./connection')

server.use(cors())
server.use(express.json())
server.use(router)




const port=4000 ||process.env.PORT

server.listen(port,() => {
    console.log(`server listening on ${port}`);
    
})
server.get('/',(req,res) =>{
    res.status(200).send(`<h1 style="color:red">Server is started and waiting for client request</h1>`)
})
