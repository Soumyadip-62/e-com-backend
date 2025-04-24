const {Schema,model} = require('mongoose')

    const userSchema = new Schema({
        username:{type:String, require:true},
        email:{type:String, require:true, unique:true, dropDups:true},
        password:{
            type:String,
            required:true,
            select:false
        }
    })

    const User = model('User', userSchema)

    module.exports = User;