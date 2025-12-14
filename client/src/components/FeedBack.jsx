import emailjs from "emailjs-com";
import toast from "react-hot-toast";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function FeedBack() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.message) {
      toast.error("Please fill out subject and message.");
      return;
    }

    setLoading(true);
    toast.loading("Sending feedback...");

    emailjs
      .send("service_fm1zz58", "template_f8n5q5t", form, "EhlaqFPru5Lp5lrf4")
      .then(
        () => {
          toast.dismiss();
          toast.success("Message sent successfully!");
          setForm({ name: "", email: "", subject: "", message: "" });
        },
        () => {
          toast.dismiss();
          toast.error("Failed to send. Please try again.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col py-6">

      {/* MAIN WHITE CARD */}
      <div className="bg-white w-[95%] max-w-6xl mx-auto mt-4 p-6 lg:p-10 rounded-lg shadow flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2">

          {/* Avatar */}
          <div className="w-48 h-48 lg:w-80 lg:h-80 bg-gray-300 rounded overflow-hidden flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600">User Image</span>
            )}
          </div>

          <h2 className="text-2xl lg:text-3xl font-semibold mt-4">
            {user?.name || "Your Name"}
          </h2>
          <p className="text-gray-400 mt-1 text-base">
            {user?.email || "Your Email"}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-b lg:border-b-0 lg:border-l border-gray-300"></div>

        {/* RIGHT SIDE FEEDBACK FORM */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl lg:text-4xl font-semibold ">Feed Back</h2>
          <p className="text-sm mb-6 text-gray-400">Good day, how can we help you today ?</p>

          <form onSubmit={sendEmail} className="space-y-5">

            {/* NAME - autofilled but editable */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full bg-gray-100 p-4 rounded text-gray-700"
              value={form.name || user?.name || ""}
              onChange={handleChange}
            />

            {/* EMAIL - autofilled but editable */}
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full bg-gray-100 p-4 rounded text-gray-700"
              value={form.email || user?.email || ""}
              onChange={handleChange}
            />

            {/* SUBJECT */}
            <input
              type="text"
              name="subject"
              placeholder="Subject of your feed back"
              className="w-full bg-gray-100 p-4 rounded text-gray-700"
              value={form.subject}
              onChange={handleChange}
            />

            {/* MESSAGE */}
            <textarea
              name="message"
              rows="6"
              placeholder="Write your full feed back here"
              className="w-full bg-gray-100 p-4 rounded text-gray-700"
              value={form.message}
              onChange={handleChange}
            />

            {/* SEND BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded text-lg font-medium cursor-pointer bg-[#B7E4A8] hover:opacity-90 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
