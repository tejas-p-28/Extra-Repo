let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
// const mongoUrl = "mongodb://localhost:27017"
const mongoUrl = "mongodb+srv://netmeds:netmeds123@cluster0.x6wa1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const cors = require('cors')
let port = process.env.PORT || 8210;
var db;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())
//get
app.get('/',(req,res) => {
    res.send('Welcome to Express')
})


//products 
app.get('/product',(req,res) => {
    db.collection('product').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


//product wrt category
app.get('/category',(req,res) => {
    let typeId  = Number(req.query.type_id)
    let sortId = Number(req.query.sort_id)
    let query = {};
    if(typeId){
        query = {type_id:typeId}
    }
    else if(sortId){
        query = {"sortType.sort_id":sortId}
    }
    console.log(">>>>typeId",typeId)
    db.collection('category').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//filter
app.get('/filter/:sortId', (req,res) => {
    let categoryId = Number(req.params.categoryId);
    let productId = Number(req.params.productId)
    let query = {}
    if (categoryId){
        query = {"products_id":productId,"category.category_id":categoryId}
    }
    
    db.collection('category').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//sort
app.get('/sort',(req,res) => {
    db.collection('sort').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//product Details
//product wrt category
app.get('/details/:id',(req,res) => {
    let typeId  = Number(req.params.id)
    console.log(">>>>typeId",typeId)
    db.collection('category').find({_id:typeId}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//product selected wrt to category
app.get('/menu/:id',(req,res) => {
    let typeId  = Number(req.params.id)
    console.log(">>>>typeId",typeId)
    db.collection('desc').find({care_id:typeId}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//product selected using user selection
app.post('/menuItem',(req,res) => {
    console.log(req.body)
    db.collection('desc').find({care_id:{$in:req.body}}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


//get orders
app.get('/orders',(req,res) => {
    let email  = Number(req.query.email)
    let query = {};
    if(email){
        query = {"email":email}
    }
    
    db.collection('orders').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//place order
app.post('/placeorder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) =>{
        if(err) throw err;
        res.send("Order Added")
    })
})

//update order 
app.put('/updateOrder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id)
    let status = req.query.status
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "status":status,
            "bank_name":req.body.bank_name,
            "bank_status":req.body.bank_status
        }},(err,result) => {
            if(err) throw err;
            res.send(`Status Updated To ${status}`) 
        }
    )
})

MongoClient.connect(mongoUrl, (err,connection) => {
    if(err) console.log("Error While Connecting");
    db = connection.db('netmeds');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });
})