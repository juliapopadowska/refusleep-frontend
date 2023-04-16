import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import "./Header.scss";
import { CgProfile } from "react-icons/cg";
import Dropdown from "react-bootstrap/Dropdown";
import { PL, GB, DE, UA } from "country-flag-icons/react/3x2";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext";
import i18n from "../../../localization/i18n";
import { useTranslation } from "react-i18next";
import { Apartment } from "../../../types";

type HeaderProps = {
  type?: string;
  apartments?: Apartment[];
  setData?: Dispatch<SetStateAction<Apartment[]>>;
};

const languagesCheckboxInitial = [
  { name: "Polish", checked: false },
  { name: "English", checked: false },
  { name: "German", checked: false },
  { name: "Ukrainian", checked: false },
];

const typesCheckboxInitial = [
  { name: "Apartment", checked: false },
  { name: "Couch", checked: false },
  { name: "Room", checked: false },
];

function Header({ type, apartments, setData }: HeaderProps) {
  const { t } = useTranslation();
  const [lang, setLang] = useState<string>("English");
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const { user, setUser } = useContext(UserContext);
  const [cityName, setCityName] = useState("Warsaw");
  const [languagesCheckbox, setLanguagesCheckbox] = useState(
    languagesCheckboxInitial
  );
  const [apartmentType, setApartmentType] = useState(typesCheckboxInitial);

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

  const handleChangeLanguageCheckbox = (index: number) => {
    setLanguagesCheckbox(
      languagesCheckbox.map((lang, currentIndex) =>
        currentIndex === index ? { ...lang, checked: !lang.checked } : lang
      )
    );
  };

  const handleChangeTypeCheckbox = (index: number) => {
    setApartmentType(
      apartmentType.map((lang, currentIndex) =>
        currentIndex === index ? { ...lang, checked: !lang.checked } : lang
      )
    );
  };

  const checkIfLanguage = (
    apartment: Apartment,
    details: string,
    index: number
  ) => {
    if (languagesCheckbox[index].checked) {
      if (apartment[`${details}` as keyof Apartment] !== "") return true;
      else return false;
    }
    return true;
  };

  const checkIfType = (apartment: Apartment, index: number) => {
    if (apartmentType[index].checked) {
      if (apartment.type === apartmentType[index].name) return true;
      else return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (setData && apartments)
      setData(
        apartments
          .filter((elem) => elem.city === cityName)
          .filter((elem) => checkIfLanguage(elem, "polishDetails", 0))
          .filter((elem) => checkIfLanguage(elem, "englishDetails", 1))
          .filter((elem) => checkIfLanguage(elem, "germanDetails", 2))
          .filter((elem) => checkIfLanguage(elem, "ukrainianDetails", 3))
          .filter((elem) => checkIfType(elem, 0))
          .filter((elem) => checkIfType(elem, 1))
          .filter((elem) => checkIfType(elem, 2))
      );
  };

  const handleClearSearch = () => {
    if (setData && apartments) setData(apartments);
    setLanguagesCheckbox(
      languagesCheckbox.map((lang) => {
        return { ...lang, checked: false };
      })
    );
    setApartmentType(
      apartmentType.map((lang) => {
        return { ...lang, checked: false };
      })
    );
  };

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
              enim ad minim veniam Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam
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
            <div className="Search-container">
              <div className="Search-checkboxesContainer">
                <p>Languages: </p>
                <div className="Search-checkboxes">
                  {languagesCheckbox.map((lang, index) => {
                    return (
                      <Form.Check
                        inline
                        name="group1"
                        label={lang.name}
                        type="checkbox"
                        id={`inline-checkbox-${index}`}
                        className="AddPlace-checkbox"
                        checked={lang.checked}
                        onChange={() => handleChangeLanguageCheckbox(index)}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="Search-checkboxesContainer">
                <p>Type:</p>
                <div className="Search-checkboxes">
                  {apartmentType.map((type, index) => {
                    return (
                      <Form.Check
                        inline
                        name="group2"
                        label={type.name}
                        type="checkbox"
                        id={`inline-checkbox-${4 + index}`}
                        className="AddPlace-checkbox"
                        checked={type.checked}
                        onChange={() => handleChangeTypeCheckbox(index)}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
              <Button className="Search-button" onClick={handleClearSearch}>
                Clear
              </Button>
              <Button className="Search-button" onClick={handleSearch}>
                Submit
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
