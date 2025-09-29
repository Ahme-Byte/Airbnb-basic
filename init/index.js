const mongoose=require('mongoose');
const {data}=require('./data');
const listing=require('../listing');
const url='mongodb://127.0.0.1:27017/wanderlast';
main()
.then((r)=>{
    console.log('connection successfull');
}).catch((e)=>{
    console.log(e.message);
})
async function main(){
await mongoose.connect(url);
}

async function put(){
    await listing.deleteMany({});
   await listing.insertMany(data);
   console.log('Data Saved');
   mongoose.connection.close();
}
put();
