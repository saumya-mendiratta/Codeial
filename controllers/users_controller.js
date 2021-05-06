const User = require('../models/user');

//For deleting prdvious avatars 
const fs = require('fs');
const path = require('path');

const Friendship = require('../models/friendship');

// let's keep it same as before
module.exports.profile = function(req, res){

    User.findById(req.params.id , function(err, user){

        let are_friends = false;

        Friendship.findOne({
            $or: [{ from_user: req.user._id, to_user: req.params.id },
            { from_user: req.params.id, to_user: req.user._id }]
        }, function (error, friendship)
        {
            if (error)
            {
                console.log('There was an error in finding the friendship', error);
                return;
            }
            if (friendship)
            {
                are_friends = true;
            }

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user,
            are_friends: are_friends
        });
    });

    });
 
}

//To update user data
module.exports.update = async function(req, res){
    
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id , req.body , function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     //HTTP codes
    //     req.flash('error', 'Unauthorized!');
    //    return res.status((401).send('Unauthorized'));
    // }

    if(req.user.id == req.params.id){
        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('****Multer error***' , err)};

                // could not have used reqif multer was not used
                user.name =req.body.name;
                user.email =req.body.email;

                //If avatar is uploaded
                if(req.file){

                    if(user.avatar){
                        let fileExists = fs.existsSync(path.join(__dirname , '..' , user.avatar));

                        if(fileExists){
                            fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                        }
                    }

                    //This is saving the path of the uploaded file in avatar field in user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error' , err);
            return res.redirect('back');
        }

    }else{
        // HTTP codes
        req.flash('error', 'Unauthorized!');
       return res.status((401).send('Unauthorized'));
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    //If user is already logged in,isAuthenticated is passportjs function
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
     //If user is already logged in,isAuthenticated is passportjs function
     if(req.isAuthenticated()){
       return  res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){

    //Flash message
    req.flash('success', 'Logged in Succesfully');

    //session is created in passport js
    return res.redirect('/');
}

//For signing out
module.exports.destroySession = function(req, res){

    req.logout();
    
    //Flash message
    req.flash('success', 'You have Logged out');
    return res.redirect('/');
}