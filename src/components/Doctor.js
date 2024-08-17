import React from "react";
import { useNavigate } from "react-router-dom";

const Doctor = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2 cursor-pointer"
      style={{
        background: "linear-gradient(to bottom, #005555, #f0f0f0)",
      }}
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    >
      <h1 className="card-title1" style={{ color: "white" }}>
        {doctor.firstName} {doctor.lastName}
      </h1>
      <hr style={{ marginTop: "2px", marginBottom: "5px", color: "white" }} />
      <p>
        <b>Mobile Number : </b>
        {doctor.phoneNumber}
      </p>
      <p>
        <b>Address : </b>
        {doctor.address}
      </p>
      <p>
        <b> Fee per Visit : </b>
        {doctor.feePerCunsultation}
      </p>
      <p>
        <b>Timings : </b>
        {doctor.timings[0]}-{doctor.timings[1]}
      </p>
    </div>
  );
};

export default Doctor;

