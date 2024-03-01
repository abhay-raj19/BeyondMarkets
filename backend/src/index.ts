import express from 'express';

const app = express();

app.get('/',(req,res)=>{
    res.send("working all fine");
})


app.listen(3000,()=>{
    console.log("App is deployed on 3000!");
})