const Auth = require('./auth')

module.exports = function(config){
  let auth = new Auth()
  config.auth = {
    checkPassword(salt,pass,proposed){
      return auth.verify_password(salt,pass,proposed)
    },
    hashPassword(pass){
      return auth.encrypt_password(pass)
    },
    authUser(username,password){
      return config.common.storage.db.users.findOne({ $or: [{username: username}, {email: username}] })
        .then(user => {
          if (!user) return false
          return auth.verify_password(user.salt, user.password, password)
            .then(valid => valid ? user : false)
        })
    }
  }
  if(config.engine) require('./engine')(config,auth)
  if(config.backend) require('./backend')(config,auth)
}