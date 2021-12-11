import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  getDonationCount,
  getCreatorName,
  dateDiffInDays,
  fillBar,
} from "../../services/utils";
import default_img from '../../assets/images/default_img350by200.png';
import LoadingAnimation from "../LoadingAnimation.js";

const ObitCard = (data) => {
  const [obit, setObit] = useState({});
  const [pledgeCount, setPledgeCount] = useState(0);
  const [creator, setCreator] = useState("");
  const [funding, setFunding] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);


  const spinnerRef = useRef();

  useEffect(() => {
    let mounted = true;

    const showSpinner = () => spinnerRef.current.classList.remove('loadSpinner--hide');

    if (mounted) {
      showSpinner()
    }
    return () => mounted = false;
  }, [data.data]);

  useEffect(() => {
    let mounted = true;

    const {
      id,
      user_id,
      first_name,
      last_name,
      short_message,
      long_message,
      funding_goal,
      balance,
      obit_image,
      date_goal,
      category,
    } = data.data;

    const obitData = {
      id: id,
      user_id: user_id,
      first_name: first_name,
      last_name: last_name,
      short_message: short_message,
      long_message: long_message,
      funding_goal: funding_goal,
      balance: balance,
      obit_image: obit_image,
      date_goal: date_goal,
      category: category,
    };

    if (mounted) {
      setObit({ ...obitData });
    }
    return () => mounted = false;
  }, [data.data]);



  useEffect(() => {
    let mounted = true;
    (async () => {
      if (obit.user_id) {
        try {
          const ownerName = await getCreatorName(obit.user_id);
          if(mounted) {
            setCreator(ownerName);
          }
        } catch (err) {
          console.error(err);
        }
      }
    })();
    return () => mounted = false;
  }, [obit]);

  useEffect(() => {
    let mounted = true;

    const current = parseInt((obit.balance * 100) / obit.funding_goal);
    const percentFunded = current + "% funded";
    if (mounted) {
      setFunding(percentFunded);
    }
    return () => mounted = false;
  }, [obit.balance, obit.funding_goal])

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if(mounted && obit.id) {
        const pledgeNum = await getDonationCount(obit.id);
        getDonationCount(pledgeNum);
        }
      } catch(e) {
        console.error(e);
      }
    })();
    return () => mounted = false;
  }, [obit.id]);

  useEffect(() => {
    let mounted = true;

    (async() => {
      const days = dateDiffInDays(obit.date_goal);

      if(mounted) {
        setDaysRemaining(days);
      }
    })()
    return () => mounted = false;
  },[obit.date_goal])

  useEffect(() => {
    let mounted = true;

    const hideSpinner = () => spinnerRef.current.classList.add('loadSpinner--hide');

    if (mounted) {
      setTimeout(() => {
        hideSpinner()

      }, 2000)
    }
    return () => mounted = false;
  }, [obit]);

  const remainingDays = () => {
    if (daysRemaining >= 0) {
      return (
        <div className="obitcard__bottomdata-days">
          <span>{daysRemaining + " days to go"}</span>
        </div>
      );
    } else if (daysRemaining === -1) {
      return (
        <div className="obitcard__bottomdata-days">
          <span>{`Ended 1 day ago`}</span>
        </div>
      );
    }

    return (
      <div className="obitcard__bottomdata-days">
        <span>{`Ended ${Math.abs(daysRemaining)} days ago`}</span>
      </div>
    );
  };

  return (
    <>
      <div className="obitcard">
        <div>
          <div className="obitcard__wrapper">
            <div className="obitcard__container">
              <div className="obitcard__picturebox">
                <NavLink
                  to={"/obit/" + obit.id}
                  className="obitcard__picturebox-navlink"
                >
                  <div ref={spinnerRef} className="loadSpinner">
                    <LoadingAnimation size={"MED"} />
                  </div>
                  <div
                    style={
                      obit.obit_image
                        ? { backgroundImage: `url(${obit.obit_image})` }
                        : { backgroundImage: `url(${default_img})`}
                    }
                    className="obitcard__picture"
                  ></div>
                </NavLink>
              </div>
              <div>
                <div className="obitcard__topdata">
                  <div className="obitcard__topdata-text-container">
                    <NavLink
                      to={"/obit/" + obit.id}
                      className="obitcard__topdata-name"
                    >
                      <h3 className="obitcard__topdata-header">{obit.first_name + ' ' + obit.last_name}</h3>
                      <p className="obitcard__topdata-desc">{obit.short_message}</p>
                      <p className="obitcard__middledata-desc">{obit.long_message}</p>
                    </NavLink>
                  </div>
                </div>
                <div className="obitcard__topdata-creator">
                  <div style={{ display: "inline-block" }}>
                    <NavLink
                      to={{
                        pathname: "/discover/users/" + creator,
                        state: { creator_id: obit.user_id },
                      }}
                      className="obitcard__topdata-creator-link"
                    >
                      <span>{"By " + creator}</span>
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="obitcard__bottomdata">
                <div className="obitcard__bottomdata-fillbar">
                  <div
                    className="obitcard__bottomdata-fillbar-progress"
                    style={fillBar(obit.balance, obit.funding_goal)}
                  ></div>
                </div>
                <div className="obitcard__bottomdata-campaign">
                  <div className="obitcard__bottomdata-pledged">
                    <span>{pledgeCount + " pledged"}</span>
                  </div>
                  <div className="obitcard__bottomdata-percent-funded">
                    <span>{funding}</span>
                  </div>
                  {remainingDays()}
                  <div className="obitcard__bottomdata-days">
                    <span className="obitcard__bottomdata-days-text">
                      {"End date: " + obit.date_goal}
                    </span>
                  </div>
                  <div>
                    {obit.category ? (
                      <NavLink
                        to={"/discover/" + obit.category.toLowerCase()}
                        className="obitcard__bottomdata-category"
                      >
                        {obit.category}
                      </NavLink>
                    ) : (
                        <NavLink
                          to={"#"}
                          className="obitcard__bottomdata-category"
                        >
                          Category
                        </NavLink>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObitCard;
