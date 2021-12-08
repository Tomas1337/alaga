
import React, { useState } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import ImageUploader from "../image-uploader";

const Step2 = props => {
  // Get url_image from Child Component ImageUploader
  const updateUrl_image = (url) => {
    props.handleImageChange(url);
  };

  if (props.currentStep !== 2) {  
      return null;
    }

  return (  
    <>
      <p className="new-obit-form__header">Obituary Information</p>
      <FormGroup>
        <div style = {{
            display: "block",
            maxHeight: "100px"
          }}>
          <div>
            <Label for="obit_image">Photo of the departed </Label>
          </div>
          <ImageUploader 
            updateUrl_image2={updateUrl_image} 
            value={props.obit_image} // Prop: The obit_image input data
            // id="uploadImage"
            // name="uploadImage"
            />
        </div>
        <div style = {{ 
          display: "block",
          paddingTop: "12rem"
        }}>
        <Label for="short_message">Write a short description here </Label>
        <Input className="new-obit-form__input-field"
          type="text"
          name="short_message"
          id="short_message"
          placeholder="Place a short message (max 50 characters)"
          value={props.short_message} // Prop: The short_message input data
          onChange={props.handleChange} // Prop: Puts data into the state
          maxLength={50}
        />
        <Label for="long_message">Write your obituary message here</Label>
        <Input 
          className="new-obit-form__input-field"
          style = {{
            height: "300px"
          }}
          type="textarea"
          name="long_message"
          id="long_message"
          placeholder="Place a long message here (max 1,000 characters)"
          value={props.long_message} // Prop: The long_message input data
          onChange={props.handleChange} // Prop: Puts data into the state
          maxLength={1000}
        />
        </div>
        
      </FormGroup>
    </>
  );
};

export default Step2;
