import CommentBar from "./CommentBar"
import React, { useEffect, useRef, useState }from "react";
import Comment from "./Comment"

const CommentWall = props => {
    // Create a comment wall that displays all comments
    // The comment form is a child component of the comment wall
    // The comment wall is a child component of the Obit Profile

    const [comments, setComments] = useState([])
    const obitId = props.obit_id

    let comment_name = "Comment Name"

    // Create function for pulling data from database to populate comments
    const getComments = () => {
        // Get comments from database
        fetch(`/api/obits/${obitId}/comments`)
            .then(response => response.json())
            .then(comments => {
                console.log(comments)
                // Set state to the comments
                setComments(comments)
            })
    }

    const commentItems = comments.map((comment) =>
        <Comment key={comment.id} comment={comment.comment} author={comment.author} />)
    

    // on Initiation of component, call getComments function
    useEffect(() => { 
        getComments()         
    },  []);

    return (
        // Display the comments' name and comment as a list
        <div>    
            {commentItems}
        </div>   


    );
            }


export default CommentWall;
