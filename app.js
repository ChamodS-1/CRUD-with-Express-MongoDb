const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/detailsDB')
    .then(()=> console.log('connected...'))
    .catch((err)=> console.log(err.message));

const schema = mongoose.Schema({
    firstName:{type:String,required:true,minlength:3,maxlength:15},
    lastName:{type:String,required:true,minlength:3,maxlength:15},
    email:{type:String,required:true}
})

const Detail = mongoose.model('detail',schema);

app.get('/api/details',async(req,res)=> {

    try{
        const result =  await Detail.find();
        res.send(result);
    }catch(err){
        res.status(500).send(err.message)
    }   
})

app.get('/api/detail/:id',async(req,res)=> {

        try{
            const selectedDetails =  await Detail.findById(req.params.id);
            res.send(selectedDetails);   
        }catch(err){
            res.status(500).send('Details Not Found');
        }    
});

app.post('/api/details',async(req,res)=>{

    const detail = new Detail({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email
    })

    try{
        const result = await detail.save();
        res.send(result);
    }catch(err){
        for(const field in err.errors){
            res.status(500).send(err.errors[field].message);
        }
        
    }   
})

app.put('/api/detail/:id',async(req,res)=> {

    try{
        const result = await Detail.findById(req.params.id);
        result.set({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email
        })

        try{
            const saved =  await result.save();
            res.send(saved);
        }catch(err){
            for(const field in err.errors){
                res.status(500).send(err.errors[field].message);
            }
        }
   
    }catch(err){
        res.status(500).send('Not Found!');
    } 
})

app.delete('/api/detail/:id',async(req,res)=> {

    try{
        const result = await Detail.findByIdAndDelete(req.params.id);
        res.send(result);
    }catch(err){
        res.status(500).send('Not Found');
    }
    
})

app.listen(3000, () => { console.log(`starting port 3000...`)});