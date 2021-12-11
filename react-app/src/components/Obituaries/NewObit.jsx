import React, { Component } from "react";
import {
  Form,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardFooter
} from "reactstrap";


import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Redirect } from "react-router-dom";
import MultiStepProgressBar from "./MultiStepProgressBar";


class NewObit extends Component {
  constructor(props) {
    super(props);
    // Set the intiial input values
    this.state = {
      
      currentStep: 1,
      redirectToObit: false,
      obitId: "",
      // First Step
      firstName: "",
      middleName: "",
      lastName: "",
      nickName: "",
      deathDate: "",
      birthDate: "",
      
      // Second Step
      short_message: "",
      long_message: "",
      obit_image: "",

      // Third Step
      onlineService: "",
      memorialStartDate: "",
      memorialEndDate: "",
      financialAssistance: "",
      bankClientName: "",
      bankName: "",
      bankAccountNumber:"",
      
    };

    // Bind the submission to handleChange()
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    // Bind new functions for next and previous
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
  }

  // Use the submitted data to set the state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  // Handle the image url event
  handleImageChange = url => {
    this.setState({
      obit_image:url
    });
  };

  // Trigger an alert on form submission
  handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, middleName, lastName, nickName,
      funding_goal, death_date, birth_date, short_message, 
      long_message, obit_image} = this.state;
    // alert(`Your registration detail: \n 
    //   First Name: ${firstName} \n 
    //   Middle Name: ${middleName} \n
    //   Last Name: ${lastName}`);

    const response = await fetch("/api/obits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          middleName,
          lastName,
          funding_goal,
          nickName,
          death_date,
          birth_date,
          short_message,
          long_message,
          obit_image,
        }),
      });
      const obit = await response.json();

      this.setState({
        obitId: obit.id,
        redirectToObit: true
      })
      //this.routingFunction()
      // this.history.push('/obit/${obit.id}');
  };

  // Test current step with ternary
  // _next and _previous functions will be called on button click
  _next() {
    let currentStep = this.state.currentStep;

    // Check if required fields are filled before going to the next step
    if (currentStep === 1) {
      if (
        this.state.firstName !== "" &&
        this.state.middleName !== "" &&
        this.state.lastName !== ""
      ) {
        console.log("Step 1 is complete");
        currentStep = currentStep + 1;
        this.setState({
          currentStep: currentStep + 1
        });
      } else {
        alert("Please fill in all required fields");
      }
    } else if (currentStep === 2) {
      if (
        this.state.short_message !== "" &&
        this.state.short_message !== ""
      ) {
        console.log("Step 2 is complete");
        currentStep = currentStep + 1;
        this.setState({
          currentStep: currentStep + 1
        });
      } else {
        alert("Please fill in all required fields");

      }
    } else if (currentStep === 3) {
      if (
        {}
      ) {
        console.log("Step 3 is complete");
        currentStep = currentStep + 1;
        this.setState({
          currentStep: currentStep + 1
        });
      } else {  
        alert("Please fill in all required fields");
      }
    }

    // If the current step is 1 or 2, then add one on "next" button click
    //currentStep = currentStep >= 2 ? 3 : currentStep + 1;
    console.log(currentStep)
    this.setState({
      currentStep: currentStep
    });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep
    });
  }

  // The "next" and "previous" button functions
  get previousButton() {
    let currentStep = this.state.currentStep;

    // If the current step is not 1, then render the "previous" button
    if (currentStep !== 1) {
      return (
        <Button color="secondary float-left" onClick={this._prev}>
          Previous
        </Button>
      );
    }

    // ...else return nothing
    return null;
  }

  get nextButton() {
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if (currentStep < 3) {
      return (
        <Button id='next_button' name='next_button' color="primary float-right" onClick={this._next}>
          Next
        </Button>
      );
    }
    // ...else render nothing
    return null;
  }

  get submitButton() {
    
    let currentStep = this.state.currentStep;

    // If the current step is the last step, then render the "submit" button
    if (currentStep > 2) {
      return <Button name='submit_button' color="primary float-right" onClick={this.handleSubmit}>Submit</Button>;
    }
    // ...else render nothing
    return null;
  }

  render() {
    const redirectToObit = this.state.redirectToObit;
    const newObitId = this.state.obitId;
    if ( redirectToObit) {
      return <Redirect to={`/obit/${newObitId}`} />
    }
    return (
      <>
      <div className="new-obit-page__main-container">
        <Form className="new-obit-form__form-container" 
          onSubmit={this.handleSubmit}>
          <Card>
            <CardHeader className = "new-obit-form__title">Create a Listing</CardHeader>
            <CardBody >
            <CardTitle className ="new-obit-form__MultiStepProgressBar">
              <MultiStepProgressBar 
                currentStep={this.state.currentStep} />
            </CardTitle>
                <CardText />
                <div className = "new-obit-form__Step1" >
                <Step1
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                />
                </div>
                <div className = "new-obit-form__Step1" >
                <Step2
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                  handleImageChange={this.handleImageChange}
                />
                </div>
                <Step3 
                  currentStep={this.state.currentStep}
                  handleChange={this.handleChange}
                />
            </CardBody>
            <CardFooter>
              {this.previousButton}
              {this.nextButton}
              {this.submitButton}
            </CardFooter>
          </Card>
        </Form>
        </div>
      </>
    );
  }
}

export default NewObit;
