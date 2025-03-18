const mongoose = require('mongoose')

const connectionstring=process.env.CONNECTIONSTRING

mongoose.connect(connectionstring).then((res)=>{
    console.log(`mongodb connection is successfully established`);
    
}).catch((err)=>{
    console.log('mongodb connection failed');
    console.log(err);
    
    
})