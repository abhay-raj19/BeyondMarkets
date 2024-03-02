import express, {Express,Request, Response, query} from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
// import { PrismaClient } from '@prisma/client'
// export const prisma = new PrismaClient({
//     log:['query']
// })

const app:Express = express();
app.use(express.json())
app.use('/api/v1',rootRouter)


app.listen(PORT,()=>{
    console.log("App is deployed on 3000!");
})