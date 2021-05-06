const Post= require('../models/post') ;
//Requiring to delete comments from post
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res){

    try{

        // return res.end(' <h1> Posts is loaded </h1>');
        let post = await Post.create({
        content : req.body.content,
        user : req.user._id 
    });


    if(req.xhr){
         // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
         post = await post.populate('user', 'name').execPopulate();
        return res.status(200).json({
            data:{
                post:post
                // name :  req.user.name
            },message :"Post created"
        })
    }

    req.flash('success' , 'Post published !');
    return res.redirect('back');

    }catch(err){
        // console.log('Error' , err);
        req.flash('error' , err);
        return;
    }

}

module.exports.destroy = async function(req,res){

 try{
         //Find the post before deleting wheather it exists or nopt
    let post = await Post.findById(req.params.id);

    //Check authentication that the user is same of posting and deleting
    // .id means converting the object id into string 
    if(post.user == req.user.id){

        // CHANGE :: delete the associated likes for the post and all its comments' likes too
        await Like.deleteMany({likeable: post, onModel: 'Post'});
        await Like.deleteMany({_id: {$in: post.comments}});

       post.remove();

       //Deleting comments of post
       await Comment.deleteMany({post:req.params.id});

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post_id:req.params.id
                },message : "Post deleted"
            });
        }

       req.flash('success' , 'Post and associated comments deleted!');

       return res.redirect('back');
   }else{
       req.flash('error' , 'You can not delete this post');
       res.redirect('back');
   }

 }catch(err){
        // console.log('Error' , err);
        req.flash('error' , err);
        return res.redirect('back');
    }
   
}