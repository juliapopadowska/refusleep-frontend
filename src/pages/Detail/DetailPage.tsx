import axios from "axios";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import { Apartment, User } from "../../types";
import "./DetailPage.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "react-i18next";
import { Alert, Spinner } from "react-bootstrap";

function DetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<Apartment>();
  const [owner, setOwner] = useState<User>();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          await axios.get(`/api/apartments/apartment/${id}`).then((res) => {
            setData(res.data);
          });
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
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingUser(true);
        if (data) {
          const { owner } = data;
          await axios.post("/api/users/user-by-id", { owner }).then((res) => {
            setOwner(res.data);
          });
        }
        setLoadingUser(false);
      } catch (error) {
        setLoadingUser(false);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    };
    fetchData();
  }, [data]);

  return (
    <div>
      <Header />
      {loading || loadingUser ? (
        <div className="Spinner-container">
          <Spinner className="Spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        data && (
          <div className="DetailPage-container">
            <Carousel showThumbs={false} showArrows>
              {data?.photos.map((photo) => {
                return (
                  <img
                    className="DatailPage-photo"
                    alt={`${photo}`}
                    src={photo}
                    key={photo}
                    height="450px"
                  />
                );
              })}
            </Carousel>
            <div className="Detail-detailsContainer">
              {data?.polishDetails !== "" && (
                <div>
                  <p className="Detail-span">{t("Details.Polish")}:</p>
                  <div className="Detail-desc">{data?.polishDetails}</div>
                </div>
              )}
              {data?.englishDetails !== "" && (
                <div>
                  <p className="Detail-span">{t("Details.English")}: </p>{" "}
                  <div className="Detail-desc">{data?.englishDetails}</div>
                </div>
              )}
              {data?.frenchDetails !== "" && (
                <div>
                  <p className="Detail-span">{t("Details.French")}: </p>
                  <div className="Detail-desc">{data?.frenchDetails}</div>
                </div>
              )}
              {data?.ukrainianDetails !== "" && (
                <div>
                  <p className="Detail-span">{t("Details.Ukrainian")}:</p>
                  <div className="Detail-desc">{data?.ukrainianDetails}</div>
                </div>
              )}
              <div className="Detail-details">
                <div>
                  <h4>{t("Informations")}:</h4>
                  <div className="Detail-detailContainer">
                    <span className="Detail-span">{t("City")}: </span>
                    {t(`Cities.${data?.city}`)}
                  </div>
                  <div className="Detail-detailContainer">
                    <span className="Detail-span">{t("Address")}: </span>{" "}
                    {data?.address}
                  </div>
                  <div className="Detail-detailContainer">
                    <span className="Detail-span">{t("Type")}: </span>
                    {t(`Types.${data?.type}`)}
                  </div>
                </div>

                <div>
                  <h4>{t("ContactInfo")}:</h4>
                  <div className="Detail-detailContainer">
                    <span className="Detail-span">{t("Owner.Name")}: </span>
                    {owner?.name}
                  </div>
                  <div className="Detail-detailContainer">
                    <span className="Detail-span">{t("Owner.Email")}: </span>
                    <b>{owner?.email}</b>
                  </div>
                  <div className="Detail-detailContainer">
                    <span className="Detail-span">{t("PhoneNumber")}: </span>
                    <b>{data?.phoneNumber}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
      {error && (
        <Alert className="alert" variant="danger">
          {t("ServerError")}
        </Alert>
      )}
    </div>
  );
}

export default DetailPage;
