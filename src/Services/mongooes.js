
const mongoose = require('mongoose');

//  const conn = mongoose.connect('mongodb://cosmicuser:cosmicT0011@15.207.219.174:27017/cosmic_db', { useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false, useCreateIndex:true }); 


//for server
 const conn = mongoose.connect('mongodb://cosmicuser:cosmicT0011@127.0.0.1:27017/cosmic_db', { useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false, useCreateIndex:true }); // for local

exports.mongoose = mongoose;

exports.conn = conn;