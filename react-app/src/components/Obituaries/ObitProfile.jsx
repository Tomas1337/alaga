import React, { useEffect, useRef, useState } from "react";
import {Redirect, useHistory, useParams } from "react-router-dom";
import LoadingAnimation from "../LoadingAnimation.js";
import { dateDiffInDays, getDonationCount, fillBar } from "../../services/utils";
import default_img from '../../assets/images/default_img620by350.png';
import ObitHeader from "./ObitHeader.jsx";
import CommentBar from "../Comment/CommentBar.jsx";
import CommentWall from "../Comment/CommentWall.jsx";

const ObitProfile = (props) => {
  const [obit, setObit] = useState({});
  const [creator, setCreator] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [donation, setDonation] = useState(false);
  const [userDonationAmount, setUserDonationAmount] = useState(0);
  const [donationCount, setDonationCount] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [commentLine, setCommentLine] = useState({ commentId:"", text: "", })

  const history = useHistory();
  const spinnerRef = useRef();
  const { id } = useParams();
  const userId = props.user.id;

  //check if obit belongs to user
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/obits/${id}`);
      const res = await response.json();
      if (res.error) {
        return <Redirect exact to="/" />;
      }
      setObit(res);
      if (props.user.id !== undefined && obit.user_id === props.user.id) {
        setCanEdit(true);
      }
    })();
  }, [id, obit.user_id, props.user.id]);

  // //check if user has donation to this obit before
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch(`/api/obits/${id}/donations`);
  //     const res = await response.json();
  //     let match = res.donations.filter((donation) => donation.user_id === userId);
  //     if (match.length) {
  //       setUserDonationAmount(match[0].amount);
  //       setDonation(true);
  //     }
  //   })();
  // }, [id, userId]);

  useEffect(() => {
    (async () => {
      try {
        if (!obit.user_id) return;
        const res = await fetch(`/users/${obit.user_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw res;
        }

        const data = await res.json();
        if (data) {
          setCreator(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [obit]);

  const editProject = () => {
    history.push(`/obit/${id}/edit`);
  };

  //get total donations
  useEffect(() => {
    (async () => {
      const donationNum = await getDonationCount(id);
      setDonationCount(donationNum);
    })();
  }, [id, donation]);

  //handle donation submission
  const handleDonation = async (e) => {
    e.preventDefault();
    if (!props.authenticated) {
      history.push("/login");
    }
    //error handling for user's donation amount
    if (amount <= 0) {
      return setAmountError("Donation amount must be at least $1.00");
    } else if (!Number(amount)) {
      return setAmountError("Donation amount must be numerical");
    }

    let method = donation ? "PUT" : "POST";

    const response = await fetch(`/api/obits/${id}/donations`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        obitId: id,
        amount,
      }),
    });
    const res = await response.json();
    if (res.error) {
      return setAmountError(res.error);
    }
    if (method === "PUT") setUserDonationAmount(res.donation.amount);
    if (method === "POST") {
      setDonation(true);
      setUserDonationAmount(res.donation.amount);
    }
    setObit(res.obit);
    setAmount("");
    setAmountError("");
  };


  const submitCommentLine = async (author, comment) => {
    // Make a post request with the comment
    // fetch('/api/comments', {
    console.log('submitting comment placeholder with', author, comment)
    const response = await fetch(`/api/obits/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author,
        comment,
        obit_id: id
      }),
    });
  };


  const remainingDays = () => {
    const days = dateDiffInDays(obit.end_date);
    const fundingResult = obit.balance >= obit.funding_goal;
    if (days > 0) {
      return (
        <div className="obit-profile-page__goal-date">
          <h1>{dateDiffInDays(obit.end_date)}</h1>
          <p>days to go</p>
        </div>
      );
    } else if (days === -1) {
      return (
        <div className="obit-profile-page__goal-date">
          <h1>{fundingResult ? "Funded" : "Did not reach goal"}</h1>
          <p>{`Ended ${Math.abs(days)} day ago`}</p>
        </div>
      );
    }

    return (
      <div className="obit-profile-page__goal-date">
        <h1>{fundingResult ? "Funded" : "Did not reach goal"}</h1>
        <p>{`Ended ${Math.abs(days)} days ago`}</p>
      </div>
    );
  };

  const deleteProject = async () => {
    const response = await fetch(`/api/obits/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      history.push("/");
    }
  };

  useEffect(() => {
    let mounted = true;
    const hideSpinner = () => spinnerRef.current.classList.add('loadSpinner--hide');
    if (mounted) {
      setTimeout(() => {
        hideSpinner()

      }, 2000)
    }
    return () => mounted = false;
  }, []);

  return (
    <div className="obit-profile-page__container">
        <main className="obit-profile-page__main">
          <div className="obit-profile-page__main-container">

            {/* header section */}
            {/* <section>
              <div className="obit-header-wrapper">
                <img className="obit-header-image" src={logo} alt=""/> 
              </div>
            </section> */}

            {/* Obit Intro section */}
            <div className="obit-profile-page__header">
            <ObitHeader className="obit-message-wrapper" 
              first_name={obit.first_name}
              middle_name={obit.middle_name}
              last_name={obit.last_name} 
              short_message = {obit.short_message}/>
              
            </div>
            {/* body for picture and informational box */}
            <div className="obit-profile-page__image-container">
              <div className="obit-profile-page__image-wrapper">
                <div ref={spinnerRef} className="loadSpinner">
                  <LoadingAnimation size={"LRG"} />
                </div>
                <div
                  className="obit-profile-page__image"
                  style={
                    obit.obit_image
                      ? { backgroundImage: `url(${obit.obit_image})` }
                      : { backgroundImage: `url(${default_img})` }
                  }
                ></div>
              </div>
         
              
            </div>
            <div className="obit-profile-page__info-container">
              <div>
                {/* <div>
                  <button className="obit-profile-page__guestbook-button">
                      SIGN THE GUEST BOOK
                  </button>
                </div> */}
                <div>
                  <button className="obit-profile-page__novena-button">
                      JOIN THE ONLINE NOVENA
                  </button>
                </div>
              </div>
              <div className="obit-profile-page__progress-bar">
                <div
                  className="obit-profile-page__progress-color"
                  style={fillBar(obit.balance, obit.funding_goal)}
                ></div>
              </div>
              <div className="obit-profile-page__info-container-stats">
                <div className="obit-profile-page__balance">
                  <h1>
                    {"Php "} 
                    {obit.balance
                      ? obit.balance.toLocaleString("en-US")
                      : obit.balance}
                  </h1>
                  <p>
                    {`donation of ${  
                      obit.funding_goal
                        ? obit.funding_goal.toLocaleString("en-US")
                        : obit.funding_goal
                    }
                    goal`}
                  </p>
                </div>
                <div className="obit-profile-page__backer-total">
                  <h1>{donationCount}</h1>
                  <p>donors</p>
                </div>
                {remainingDays()}
              </div>
              <form className="obit-profile-page__form">
                {amountError ? <span>{amountError}</span> : <></>}
                <input
                  placeholder={
                    donation
                      ? `Current Donation Amount $${userDonationAmount.toLocaleString(
                          "en-US"
                        )}`
                      : "Enter Donation Amount"
                  }
                  type="number"
                  min="0.00"
                  step="1.00"
                  value={amount}
                  className="obit-profile-page__input-field"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
                {donation ? (
                  <button
                    className="obit-profile-page__button"
                    onClick={handleDonation}
                  >
                    Update Donation
                  </button>
                ) : (
                  <button
                    className="obit-profile-page__button"
                    onClick={handleDonation}
                  >
                    SUPPORT THE FAMILY
                  </button>
                )}
              </form>
              {canEdit && (
                <div className="obit-profile-page__obit-management">
                  <button
                    onClick={editProject}
                    className="obit-profile-page__edit-button"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={deleteProject}
                    className="obit-profile-page__delete-button"
                  >
                    Delete Listing
                  </button>
                </div>
              )}
              <div>
                <h3 className = 'comments-guestbook-header'> Guest book </h3>
                <CommentWall 
                  obit_id={id} 
                  />
                <CommentBar
                  submitComment = { submitCommentLine }
                />
              </div>  
            </div>
            <div className="obit-profile-long_message-container">
              <div className="obit-profile-long_message-wrapper"> 
                  <p name="long_message"> 
                    {obit.long_message }
                  </p>
              </div>
            </div>
            
            {/* </div> */}
          </div>
        </main>
    </div>
  );
};

export default ObitProfile;
