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
import { PL, GB, UA, FR } from "country-flag-icons/react/3x2";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext";
import i18n from "../../../localization/i18n";
import { useTranslation } from "react-i18next";
import { Apartment } from "../../../types";
import axios from "axios";

type HeaderProps = {
  type?: string;
  apartments?: Apartment[];
  setData?: Dispatch<SetStateAction<Apartment[]>>;
};

type Checkboxes = {
  name: string;
  checked: boolean;
};

const filtersInitial = [
  ["All"],
  [
    { name: "Polish", checked: false },
    { name: "English", checked: false },
    { name: "French", checked: false },
    { name: "Ukrainian", checked: false },
  ],
  [
    { name: "Apartment", checked: false },
    { name: "Couch", checked: false },
    { name: "Room", checked: false },
  ],
];

function Header({ type, apartments, setData }: HeaderProps) {
  const getLanguage = (language: string): string => {
    switch (language) {
      case "en":
        return "English";
      case "fr":
        return "Français";
      case "pl":
        return "Polski";
      case "ua":
        return "Українська";
      default:
        return "English";
    }
  };
  const { t } = useTranslation();
  const filtersFromStore = JSON.parse(localStorage.getItem("filters") || "{}");
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "{}");
  const [lang, setLang] = useState<string>(getLanguage(i18n.language));
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const { setUser } = useContext(UserContext);
  const [cityName, setCityName] = useState<string>(
    localStorage.getItem("filters") === null
      ? filtersInitial[0]
      : filtersFromStore[0]
  );
  const [languagesCheckbox, setLanguagesCheckbox] = useState<Checkboxes[]>(
    localStorage.getItem("filters") === null
      ? filtersInitial[1]
      : filtersFromStore[1]
  );
  const [apartmentType, setApartmentType] = useState<Checkboxes[]>(
    localStorage.getItem("filters") === null
      ? filtersInitial[2]
      : filtersFromStore[2]
  );

  const [error, setError] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("filters") === null) {
      localStorage.setItem("filters", JSON.stringify(filtersInitial));
    }
  }, []);

  useEffect(() => {
    switch (lang) {
      case "English":
        i18n.changeLanguage("en");
        break;
      case "Français":
        i18n.changeLanguage("fr");
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
    if (setData && apartments) {
      if (cityName === "All") {
        setData(
          apartments
            .filter((elem) => checkIfLanguage(elem, "polishDetails", 0))
            .filter((elem) => checkIfLanguage(elem, "englishDetails", 1))
            .filter((elem) => checkIfLanguage(elem, "frenchDetails", 2))
            .filter((elem) => checkIfLanguage(elem, "ukrainianDetails", 3))
            .filter((elem) => checkIfType(elem, 0))
            .filter((elem) => checkIfType(elem, 1))
            .filter((elem) => checkIfType(elem, 2))
        );
      } else
        setData(
          apartments
            .filter((elem) => elem.city === cityName)
            .filter((elem) => checkIfLanguage(elem, "polishDetails", 0))
            .filter((elem) => checkIfLanguage(elem, "englishDetails", 1))
            .filter((elem) => checkIfLanguage(elem, "frenchDetails", 2))
            .filter((elem) => checkIfLanguage(elem, "ukrainianDetails", 3))
            .filter((elem) => checkIfType(elem, 0))
            .filter((elem) => checkIfType(elem, 1))
            .filter((elem) => checkIfType(elem, 2))
        );
    }
  };

  const handleClearSearch = () => {
    setCityName("All");
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

  const handleLogout = () => {
    try {
      axios.post("/api/users/logout").then((res) => {
        if (res.status === 200) {
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 2000);
        }
      });
    } catch (error) {
      setError(true);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
      setError(false);
    }

    setUser({ email: "", name: "" });
    setShowProfile(false);
  };

  useEffect(() => {
    const array = [cityName, languagesCheckbox, apartmentType];
    localStorage.setItem("filters", JSON.stringify(array));
  }, [cityName, languagesCheckbox, apartmentType]);

  useEffect(() => {
    handleSearch();
  }, [apartments]);

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
                onClick={() => setLang("Français")}
              >
                <FR style={{ width: "20px" }} /> Français
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
            {userFromStorage.name === "" ? (
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
                {userFromStorage.name !== undefined
                  ? userFromStorage.name.charAt(0)
                  : "A"}
              </div>
            )}

            {showProfile &&
              (userFromStorage.name === "" ? (
                <div className="Profile-container">
                  <Link to="/login">
                    <div className="Profile-link"> {t("Login")}</div>
                  </Link>
                </div>
              ) : (
                <div className="Profile-container">
                  <Link to="/profile">
                    <div className="Profile-link"> {t("Profile")}</div>
                  </Link>
                  <div className="Profile-link" onClick={handleLogout}>
                    {t("Logout")}
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
            <p className="Welcome-paraghaph">{t("WelcomeTextLonger")}</p>
          </div>
          <div className="Header-search">
            <Dropdown>
              <Dropdown.Toggle className="Search-dropdown" id="dropdown-basic">
                {t(`Cities.${cityName}`)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setCityName("All")}>
                  {t("Cities.All")}
                </Dropdown.Item>
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
                <Dropdown.Item onClick={() => setCityName("Szczecin")}>
                  {t("Cities.Szczecin")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCityName("Katowice")}>
                  {t("Cities.Katowice")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="Search-container">
              <div className="Search-checkboxesContainer">
                <p>{t("Language")}:</p>
                <div className="Search-checkboxes">
                  {languagesCheckbox.map((lang, index) => {
                    return (
                      <Form.Check
                        inline
                        name="group1"
                        label={`${t(`Languages.${lang.name}`)}`}
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
                <p>{t("Type")}:</p>
                <div className="Search-checkboxes">
                  {apartmentType.map((type, index) => {
                    return (
                      <Form.Check
                        inline
                        name="group2"
                        label={`${t(`Types.${type.name}`)}`}
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
              <div className="Search-buttons">
                <Button className="Search-button" onClick={handleClearSearch}>
                  {t("Buttons.Clear")}
                </Button>
                <Button className="Search-button" onClick={handleSearch}>
                  {t("Buttons.Submit")}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      {showSuccessAlert && (
        <Alert className="alert" variant="success">
          {error ? t("LogoutError") : t("LogoutSuccess")}
        </Alert>
      )}
    </div>
  );
}

export default Header;
