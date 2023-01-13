import express from 'express';
import { env } from 'process';
//import authRoute from './routes/auth';
//import listingRoute from './routes/listing';


//middlewares

const port = env.PORT;
//const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//app.use('/auth', authRoute);
//app.use('/listing' ,listingRoute);



app.get('/test', (req,res)=>{
  res.send({success:true})
})


app.listen(port, ()=>{
  console.log(`Listening on ${port}`)
})



export default app