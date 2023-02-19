import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { serverUrl } from "../redux/action";
const Feedback = () => {
  const [form, setForm] = useState({
    ratings: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const inputHandlerC = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const validationCheckClient = () => {
    let flag = false;
    const { ratings, comments } = form;
    console.log(ratings);
    if (!ratings || !comments) {
      toast.error("Please fill out all the field");
    } else if (ratings > 5) {
      toast.error("Ratings should not be exceed up to 5");
    } else if (ratings <= 0) {
      toast.error("Ratings should not be 0 or negative");
    } else {
      return true;
    }
    return flag;
  };
  useEffect(() => {
    if (user.role === "vendor") navigate("/");
  }, [navigate, user.role]);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const handleOnClick = async (e) => {
    e.preventDefault();
    if (validationCheckClient()) {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/user/feedback/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        toast.success(data.message);
        navigate("/");
      } else {
        setLoading(false);
        toast.error("Please try again later");
      }
      setLoading(false);
    }
  };
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="containerRegister">
          <form className="boxR">
            <legend>Ratings</legend>
            <input
              type="text"
              value={form.ratings}
              name="ratings"
              onChange={inputHandlerC}
            />
            <legend>Comments</legend>
            <textarea
              type="text"
              value={form.comments}
              name="comments"
              onChange={inputHandlerC}
              style={{
                width: "100%",
                borderRadius: ".5rem",
              }}
            />
            <button onClick={handleOnClick}>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;
