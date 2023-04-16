import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import { Apartment } from "../../types";
import "./Homepage.scss";

function Homepage() {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const navigate = useNavigate();

  const handleDisplayDetails = (id: string) => {
    navigate(`/apartment/${id}`);
  };

  useEffect(() => {
    axios
      .get("/api/apartments/apartments")
      .then(({ data }) => setApartments(data));
  }, []);
  return (
    <div className="Homepage">
      <Header type="withSearch" />
      <div className="Homepage-listContainer">
        {apartments.map((ap, index) => {
          return (
            <div
              className="Homepage-listElements"
              key={index}
              onClick={() => handleDisplayDetails(ap._id)}
            >
              {ap.photos[0] && (
                <img
                  className="Homepage-photo"
                  alt={`${ap.address}`}
                  src={`${process.env.REACT_APP_API_URL}/uploads/${ap.photos[0]}`}
                />
              )}
              <div>
                {t(`Cities.${ap.city}`)}, {ap.address}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Homepage;
