
const mongoose = require('mongoose');

//  const conn = mongoose.connect('mongodb://cosmicuser:cosmicT0011@18.189.233.190:27017/cosmic_db', { useNewUrlParser: true,useUnifiedTopology:true,}); 


//for server
 const conn = mongoose.connect('mongodb://cosmicuser:cosmicT0011@127.0.0.1:27017/cosmic_db', { useNewUrlParser: true,useUnifiedTopology:true, }); // for local

exports.mongoose = mongoose;

exports.conn = conn;