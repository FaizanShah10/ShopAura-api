require('dotenv').config()

const isLoggedIn = async (req, res, next) => {
    if(!req.cookie.token)
        res.flash("error", "You need to login First")
        res.redirect("/")
    
    
        try {
            let decode = jwt.verify(req.cookie.token, process.env.SECRET_KEY);
            let user = await userModel.findOne({email: decode.email}).select("-password")
            req.user = user
            next() 
            
        } catch (error) {
            console.log(error.message)
        }
}

const isAdmin = async (req, res, next) => {
    const email = req.decoded.email
    const query = {email: email}
    const user = userModel.findOne(query)
    if(user.role === 'admin'){
        next()
    } else {
        res.send("You are not authorized")
    }
}

module.exports = {isLoggedIn, isAdmin}