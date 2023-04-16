import React, { useContext, useEffect, useState } from "react";
import "./Header.scss";
import { CgProfile } from "react-icons/cg";
import { FaCalendarAlt } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import { PL, GB, DE, UA } from "country-flag-icons/react/3x2";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext";
import i18n from "../../../localization/i18n";
import { useTranslation } from "react-i18next";

type DateRangeType = {
  startDate: Date;
  endDate: Date;
  key: string;
};

type HeaderProps = {
  type?: string;
};

function Header({ type }: HeaderProps) {
  const { t } = useTranslation();
  const [lang, setLang] = useState<string>("English");
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [date, setDate] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const { user, setUser } = useContext(UserContext);
  const [cityName, setCityName] = useState("Warsaw");

  useEffect(() => {
    switch (lang) {
      case "English":
        i18n.changeLanguage("en");
        break;
      case "Deutch":
        i18n.changeLanguage("de");
        break;
      case "Polski":
        i18n.changeLanguage("pl");
        break;
      case "Українська":
        i18n.changeLanguage("ua");
        break;
      default:
        i18n.changeLanguage("en");
    }
  }, [lang]);
  return (
    <div className="Header">
      <div className="Header-upperpart">
        <Link to="/">
          <img src="/logo.svg" width="60px" alt="logo" />
        </Link>
        <div className="DropdownAndProfile">
          <Dropdown>
            <Dropdown.Toggle className="Dropdown-button" id="dropdown-basic">
              {lang}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                className="DropdownItem"
                onClick={() => setLang("Polski")}
              >
                <PL style={{ width: "20px" }} /> Polski
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setLang("English")}
                className="DropdownItem"
              >
                <GB style={{ width: "20px" }} /> English
              </Dropdown.Item>
              <Dropdown.Item
                className="DropdownItem"
                onClick={() => setLang("Deutch")}
              >
                <DE style={{ width: "20px" }} /> Deutch
              </Dropdown.Item>
              <Dropdown.Item
                className="DropdownItem"
                onClick={() => setLang("Українська")}
              >
                <UA style={{ width: "20px" }} />
                Українська
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* add inicials - check if user */}
          <div className="Profile" onMouseLeave={() => setShowProfile(false)}>
            {user.name === "" ? (
              <CgProfile
                onMouseEnter={() => setShowProfile(true)}
                className="Profile-icon"
                fontSize={40}
              />
            ) : (
              <div
                onMouseEnter={() => setShowProfile(true)}
                className="Profile-inicial"
              >
                {user.name !== undefined ? user.name.charAt(0) : "A"}
              </div>
            )}

            {showProfile &&
              (user.name === "" ? (
                <div className="Profile-container">
                  <Link to="/login">
                    <div className="Profile-link"> Login</div>
                  </Link>
                </div>
              ) : (
                <div className="Profile-container">
                  <Link to="/profile">
                    <div className="Profile-link"> Profile</div>
                  </Link>
                  <div
                    className="Profile-link"
                    onClick={() => {
                      setUser({ email: "", name: "" });
                      setShowProfile(false);
                    }}
                  >
                    Logout
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {type === "withSearch" && (
        <>
          <div className="Header-bottompart">
            {/* add translation */}
            <p className="Welcome-text">{t("WelcomeText")}</p>
            <p className="Welcome-paraghaph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam
            </p>
          </div>
          <div className="Header-search">
            <Dropdown>
              <Dropdown.Toggle className="Search-dropdown" id="dropdown-basic">
                {t(`Cities.${cityName}`)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setCityName("Cracow")}>
                  {t("Cities.Cracow")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCityName("Warsaw")}>
                  {t("Cities.Warsaw")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCityName("Wroclaw")}>
                  {t("Cities.Wroclaw")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCityName("Poznan")}>
                  {t("Cities.Poznan")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCityName("Cracow")}>
                  {t("Cities.Szczecin")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCityName("Szczecin")}>
                  {t("Cities.Katowice")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="Search-date">
              <FaCalendarAlt />
              <span
                onClick={() => setOpenDate(!openDate)}
                className="Search-calendarText"
              >{`${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
                date[0].endDate,
                "dd/MM/yyyy"
              )}`}</span>
              {openDate && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    if (item.selection.endDate !== item.selection.startDate)
                      setOpenDate(false);
                    setDate([item.selection as DateRangeType]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className="Search-calendar"
                  minDate={new Date()}
                />
              )}
              <Button className="Search-button">Lorem</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
