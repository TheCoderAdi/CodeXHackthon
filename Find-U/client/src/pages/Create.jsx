import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/create.scss";
import axios from "axios";
import { serverUrl } from "../redux/action";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Create = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  let role = user && user.role;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    item: "",
    description: "",
  });
  const inputHandlerV = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleClick = async () => {
    //api rqlocalhost:5000/user/request
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${serverUrl}/user/request`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      if (data.success) {
        navigate("/");
        toast.success(data.message);
        setLoading(false);
      } else {
        toast.error("Some error occured");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (role === "vendor") navigate("/");
  }, [role, navigate]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="req-create">
          <div className="box-create">
            <legend>Category</legend>
            <select
              name="category"
              value={form.category}
              onChange={inputHandlerV}
            >
              <option value="">Choose a category</option>
              <option value="food">Food</option>
              <option value="medical">Medical</option>
            </select>
            <legend>Item</legend>
            <input
              type="text"
              name="item"
              value={form.item}
              onChange={inputHandlerV}
              placeholder="Enter your requirment"
            />
            <legend>Description</legend>
            <textarea
              type="text"
              name="description"
              value={form.description}
              onChange={inputHandlerV}
              placeholder="Enter your description"
            />
            <button
              disabled={!form.category || !form.item || !form.description}
              onClick={handleClick}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Create;
