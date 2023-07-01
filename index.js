const express = require('express');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
//const jwt = require('Jsonwebtoken');
require('dotenv').config();
 
const app = express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zapyzlw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('academia').collection('services')

        const orderCollection = client.db('academia').collection('orders')

        app.get('/services',async( req,res) => {
            //const query = { price : { $lt:500}}
            let query = {};
           

           
            const order = req.query.order === 'Ascending'? 1 : -1;

            
           
            const cursor = serviceCollection.find(query).sort({price:order});
            const services = await cursor.toArray();
         
            res.send(services);
        })
        // app.get('/services',async(req,res) => {
        //     const query = {};
        //     const cursor = serviceCollection.find(query);
        //     const services = await cursor.toArray()
        //     res.send(services)
        // })




        app.get('/services/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        // app.post('/jwt',(req,res) => {
        //     const user = req.body;
        //     console.log(user);
        //     const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
        //     res.send({token})
        // })


        //oder api
        app.get('/orders',async( req,res) => {
            let query ={};
            if( req.query.email){
                query = {
                    email : req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post('/orders',async( req,res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        app.patch('/orders/:id', async ( req,res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id:new ObjectId(id)}
            const updatedDoc = {
                $set:{
                    status:status
                }
            }
            const result = await orderCollection.updateOne(query,updatedDoc);
            res.send(result);
        })

        app.delete('/orders/:id',async( req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally{

    }
}
run().catch( error => console.error(error));



app.get('/',( req,res) => {
    res.send('academia server')
})
app.listen( port, () => {
    console.log(`academia server running on : ${port}`)
})
 



      