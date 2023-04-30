import React from "react";
import { useTranslation } from "react-i18next";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Apartment } from "../../../types";
import "./Place.scss";

interface PlaceProps {
  apartment: Apartment;
  homepage: boolean;
}

function Place({ apartment, homepage }: PlaceProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDisplayDetails = (id: string) => {
    navigate(`/apartment/${id}`);
  };

  const handleEditMode = (id: string) => {
    navigate(`/addPlace/${id}`);
  };

  return (
    <div className="Place">
      <div className="Place-listElements" key={apartment._id}>
        {apartment.photos[0] && (
          <>
            <img
              onClick={() => handleDisplayDetails(apartment._id)}
              className="Place-photo"
              alt={`${apartment.address}`}
              src={apartment.photos[0]}
            />
            {!homepage && (
              <MdModeEdit
                onClick={() => handleEditMode(apartment._id)}
                className="Place-editIcon"
              />
            )}
          </>
        )}
        <div>
          <b>{t(`Cities.${apartment.city}`)}</b>, {apartment.address}
        </div>
      </div>
    </div>
  );
}

export default Place;
