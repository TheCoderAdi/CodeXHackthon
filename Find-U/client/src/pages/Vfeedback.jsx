import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { serverUrl } from "../redux/action";

const Vfeedback = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data } = await axios.get(
        `${serverUrl}/vendor/feedback/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedbacks(data);
      feedbacks.map((d, id) => setRatings(d.ratings));
      feedbacks.map((d, id) => setComments(d.comments));
      setLoading(false);
    };
    getData(); // eslint-disable-next-line
  }, [token, user._id]);
  return (
    <div className="card-comment">
      {loading ? (
        <Loader />
      ) : comments.length && ratings.length <= 0 ? (
        <div>No feedback founds</div>
      ) : (
        feedbacks.map((feedback, id) =>
          feedback.ratings.map((comm) => (
            <div className="card-comment-h">
              <h3>{comm.user.name}</h3>
              <p>{comm.value}</p>
              {feedback.comments.map((fd, id) => (
                <p>{fd.value}</p>
              ))}
            </div>
          ))
        )
      )}
    </div>
  );
};

export default Vfeedback;
