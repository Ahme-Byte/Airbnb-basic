const mongoose=require('mongoose');
const {data}=require('./data');
const {listing}=require('../listing');
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
    let upadted_data=data.map((obj)=>({ ...obj,owner:new mongoose.Types.ObjectId('68e96119bf414c856d510926')}));
   await listing.insertMany(upadted_data);
   console.log('Data Saved');
   mongoose.connection.close();
}
put();
