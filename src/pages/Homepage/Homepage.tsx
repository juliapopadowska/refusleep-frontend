import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Header from "../../components/common/Header/Header";
import Place from "../../components/common/Place/Place";
import { Apartment } from "../../types";
import "./Homepage.scss";

function Homepage() {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [data, setData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/apartments/apartments");
        if (response.status === 200) {
          setApartments(response.data);
          setData(response.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="Homepage">
      <Header type="withSearch" apartments={apartments} setData={setData} />
      {loading ? (
        <div className="Spinner-container">
          <Spinner className="Spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : data.length > 0 ? (
        <div className="Homepage-listContainer">
          {data.map((ap, index) => {
            return <Place key={index} homepage apartment={ap} />;
          })}
        </div>
      ) : (
        <div className="Homepage-noResults">{t("NoResults")}</div>
      )}
      {error && (
        <Alert className="alert" variant="danger">
          {t("ServerError")}
        </Alert>
      )}
    </div>
  );
}

export default Homepage;
