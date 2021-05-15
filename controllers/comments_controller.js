const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id, 
                name:req.user.name,
                avatar:req.user.avatar
            });
            
              //Add comment
              post.comments.push(comment);
              post.save();
 
            comment= await comment.populate('user' , 'name email ').execPopulate();
            // commentsMailer.newComment(comment);
           let job = queue.create('emails', comment).save(function(err)
            {  
                 if(err){
                console.log("error in creating queue",err);
                return;
            }

            console.log('job enqued',job.id);

            });
            
            if(req.xhr){

                return res.status(200).json({
                    data:{
                        comment:comment
                        // name :  comment.user.name
                    },message :"Comment created"
                })
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        //Find the comment 
        let comment = await Comment.findById(req.params.id);
        comment = await comment.populate('post' , 'user ').execPopulate();

        // console.log(comment.post.user._id);
        if (comment.user == req.user.id || req.user.id == comment.post.user._id){

             //Keep post id to further del comment from this post also 
            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id:req.params.id
                    },message : "Comment deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');

        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }
    
}