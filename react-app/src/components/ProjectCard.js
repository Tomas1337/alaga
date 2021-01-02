import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import defaultimg350by200 from "../assets/images/default_img350by200.png";
import {getPledgeCount, getCreatorName, dateDiffInDays, fillBar} from '../services/utils';

const ProjectCard = (data) => {
  const [project, setProject] = useState({});
  const[pledgeCount, setPledgeCount] = useState(0);
  const [creator, setCreator] = useState('');
  const { id, user_id, title, description, funding_goal, balance, image, date_goal, category } = data.data;
  const projectData = {
    id: id,
    user_id: user_id,
    title: title,
    description: description,
    funding_goal: funding_goal,
    balance: balance,
    image: image,
    date_goal: date_goal,
    category: category
  }

  useEffect(() => {
    if (projectData) {
      setProject(projectData);
    }
  },[data])

  useEffect(() => {
    (async () => {
      if(project.user_id) {
        try {
          const ownerName = await getCreatorName(project.user_id);
          setCreator(ownerName);
        }catch(err) {
          console.log(err)
        }
      }
    })();
  }, [project])

  const funding = () => {
    const current = parseInt((balance * 100) / funding_goal).toString()
    const percentFunded = current + "%"
    return percentFunded
  };

  useEffect(() => {
    (async () => {
      const pledgeNum = await getPledgeCount(id);
      setPledgeCount(pledgeNum);
    })();
  }, [])

  const remainingDays = () => {
    const days = dateDiffInDays(project.date_goal);
    const fundingResult = project.balance >= project.funding_goal
    if (days > 0) {
      return (
        <div className='projectcard__bottomdata-days'>
          <span>{days + ' days to go'}</span>
        </div>
      )
    } else if (days === -1) {
      return (
        <div className='projectcard__bottomdata-days'>
          <span>{`Ended ${Math.abs(days)} day ago`}</span>
        </div>
      )
    }

    return (
      <div className='projectcard__bottomdata-days'>
        <span>{`Ended ${Math.abs(days)} days ago`}</span>
      </div>
    )
  }

  return (
    <>
      <div className="projectcard">
        <div>
          <div className="projectcard__wrapper">
            <div className="projectcard__container">
              <div className="projectcard__picturebox">
                <NavLink to={'/project/' + id} className="projectcard__picturebox-navlink">
                  <div style={{backgroundImage: `url(${project.image})`}} className="projectcard__picture"></div>
                </NavLink>
              </div>
              <div>
                <div className="projectcard__topdata">
                  <div className="projectcard__topdata-text-container">
                    <NavLink to={'/project/' + id} className="projectcard__topdata-name">
                      <h3 className="projectcard__topdata-header">{title}</h3>
                      <p className="projectcard__topdata-desc">{description}</p>
                    </NavLink>
                  </div>
                </div>
                <div className="projectcard__topdata-creator">
                  <div style={{display: "inline-block"}}>
                    <NavLink to="#" className="projectcard__topdata-creator-link">
                      <span>{"By " + creator}</span>
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="projectcard__bottomdata">
                <div className="projectcard__bottomdata-fillbar">
                  <div className="projectcard__bottomdata-fillbar-progress"style={fillBar(balance, funding_goal)}></div>
                </div>
                <div className="projectcard__bottomdata-campaign">
                  <div className="projectcard__bottomdata-pledged">
                    <span>{pledgeCount + ' pledged'}</span>
                  </div>
                  <div className="projectcard__bottomdata-percent-funded">
                    <span>{funding() + ' funded'}</span>
                  </div>
                  {remainingDays()}
                  <div className="projectcard__bottomdata-days">
                    <span className="projectcard__bottomdata-days-text">{'End date: ' + date_goal}</span>
                  </div>
                  <div>
                    <NavLink to={'/discover/' + category.toLowerCase()} className="projectcard__bottomdata-category">{category}</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectCard;
