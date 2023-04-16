import axios from "axios";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import { Apartment, User } from "../../types";
import "./DetailPage.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "react-i18next";

function DetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<Apartment>();
  const [owner, setOwner] = useState<User>();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      axios.get(`/api/apartments/apartment/${id}`).then((res) => {
        setData(res.data);
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      const { owner } = data;
      axios.post("/api/users/user-by-id", { owner }).then((res) => {
        setOwner(res.data);
      });
    }
  }, [data]);

  return (
    <div>
      <Header />
      <div className="DetailPage-container">
        <Carousel showThumbs={false} showArrows>
          {data?.photos.map((photo) => {
            return (
              <img
                className="DatailPage-photo"
                alt={`${photo}`}
                src={`${process.env.REACT_APP_API_URL}/uploads/${photo}`}
                key={photo}
                height="450px"
              />
            );
          })}
        </Carousel>
        <div>
          {data?.polishDetails !== "" && (
            <p>Polish details: {data?.polishDetails}</p>
          )}
          {data?.englishDetails !== "" && (
            <p>English details: {data?.englishDetails}</p>
          )}
          {data?.germanDetails !== "" && (
            <p>German details: {data?.germanDetails}</p>
          )}
          {data?.ukrainianDetails !== "" && (
            <p>Ukrainian details: {data?.ukrainianDetails}</p>
          )}
          <p>
            {t("City")}: {t(`Cities.${data?.city}`)}
          </p>
          <p>
            {t("Address")}: {data?.address}
          </p>
          <p>
            {t("Type")}: {t(`Types.${data?.type}`)}
          </p>
          <p>
            {t("Owner.Name")}: {owner?.name}
          </p>
          <p>
            {t("Owner.Email")}: {owner?.email}
          </p>
          <p>
            {t("Phone")}: {data?.phoneNumber}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
