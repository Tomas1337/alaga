import React, { useState } from "react";

const ObitHeader = (props) => { 
    return (
        <div className="obit-profile-header__wrapper">
        <h2 className="obit-profile-header__headText">
            In Loving Memory of </h2>
        <h2 className="obit-profile-header_nameText" name="obit_name"> 
            {props.first_name + " " +props.middle_name + " " + props.last_name}</h2>
        <h2 className="obit-profile-header__shortText" name="short_message"> 
            {props.short_message} </h2>

        </div>
    );

};
 
export default ObitHeader;