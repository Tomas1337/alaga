import { Component, useState } from "react";
import { render } from "react-dom";
import { Input } from "reactstrap";



const CommentBar = (props) => {
    const [nameValue, setNameValue] = useState("");
    const [commentValue, setCommentValue] = useState("");


    const enableCommentButton = () => {
        return ( commentValue && nameValue ? false : true );
    }

    const changeCommentButton =  () => {
        return ( commentValue ? "comments-button-enabled" : 
            "comments-button-disabled" );
    }

    const handleNameValue = (e) => {
        e.preventDefault();
        setNameValue(e.target.value);
    }

    const handleNameChange= (event) => {
        setNameValue(event.target.value);
    }

    function handleCommentChange(event) {
        setCommentValue(event.target.value);
    }

    function clearName() {
        setNameValue("");
    }
    
    function clearComment() {
        setCommentValue("");
    }

    const submitComment = (e) => {
        // Write a function to make post request to the server containing the comment and the name
        e.preventDefault();
        props.submitComment(nameValue, commentValue);
        clearComment();
        clearName();
    }
    

    return (
        <div className="comment-bar">
            <Input className="comment-input-name-field"
                placeholder="Name"
                value = { nameValue }  
                onChange={ handleNameChange }
            />

            <Input className="comment-input-comment-field"
                placeholder="Leave your message here"
                value = { commentValue }
                onChange = { handleCommentChange }
            />
         <button onClick = { submitComment } type="submit"
            className="comments-button"
            disabled={ enableCommentButton() }> Post </button>
        </div>
        );
    
};

export default CommentBar;