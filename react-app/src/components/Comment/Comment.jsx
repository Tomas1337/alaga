import { render } from "react-dom";
import React, { useState } from 'react';
const Comment = props => {
  
    return (
        <ul className="comments-wall">
            <li className="comments-author" key = {props.key}>
                { props.author } 
            </li>
            <li key = {props.key + 1} className='comments-comment'>
            { props.comment }
            </li>
        </ul>
        );
}   
export default Comment;