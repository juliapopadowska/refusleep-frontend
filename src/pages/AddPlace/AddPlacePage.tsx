import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Header from "../../components/common/Header/Header";
import "./AddPlacePage.scss";
import { AiOutlineCloudUpload, AiFillDelete } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import "react-phone-input-2/lib/style.css";

const languagesCheckboxInitial = [
  { name: "Polish", checked: false },
  { name: "English", checked: false },
  { name: "French", checked: false },
  { name: "Ukrainian", checked: false },
];

function AddPlacePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [address, setAddress] = useState("");
  const [polishDetails, setPolishDetails] = useState("");
  const [englishDetails, setEnglishDetails] = useState("");
  const [frenchDetails, setFrenchDetails] = useState("");
  const [ukrainianDetails, setUkrainianDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [cityName, setCityName] = useState("Warsaw");
  const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
  const [type, setType] = useState("");
  const [triedToSubmit, setTriedToSubmit] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [languagesCheckbox, setLanguagesCheckbox] = useState(
    languagesCheckboxInitial
  );
  const [loadingPage, setLoadingPage] = useState(false);

  const navigate = useNavigate();

  const uploadPhoto = async (e: any) => {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    const response = await axios.post("/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { data: filenames } = response;
    setAddedPhotos((prev) => {
      return [...prev, ...filenames] as never[];
    });
  };

  const handleAddPlace = async (e: any) => {
    setTriedToSubmit(true);
    e.preventDefault();
    if (
      addedPhotos.length > 0 &&
      languagesCheckbox.some((el) => el.checked === true)
    ) {
      e.preventDefault();
      if (id) {
        try {
          setLoading(true);
          await axios.put("/api/apartments/add", {
            id,
            cityName,
            address,
            type,
            polishDetails,
            englishDetails,
            frenchDetails,
            ukrainianDetails,
            phone,
            addedPhotos,
          });
          setLoading(false);
          navigate("/profile");
        } catch (e) {
          setLoading(false);
          setError(true);
        }
      } else
        try {
          setLoading(true);
          await axios.post("/api/apartments/add", {
            cityName,
            address,
            type,
            polishDetails,
            englishDetails,
            frenchDetails,
            ukrainianDetails,
            phone,
            addedPhotos,
          });
          setLoading(false);
          navigate("/");
        } catch (e) {
          setLoading(false);
          setError(true);
        }
    }
  };

  const deletePhoto = (link: string) => {
    setAddedPhotos(addedPhotos.filter((photo) => photo !== link));
  };

  const handleChangeCheckbox = (index: number) => {
    setLanguagesCheckbox(
      languagesCheckbox.map((lang, currentIndex) =>
        currentIndex === index ? { ...lang, checked: !lang.checked } : lang
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoadingPage(true);
          await axios.get(`/api/apartments/apartment/${id}`).then((res) => {
            setCityName(res.data.city);
            setAddress(res.data.address);
            setPhone(res.data.phoneNumber);
            setAddedPhotos(res.data.photos);
            setType(res.data.type);
            setPolishDetails(res.data.polishDetails);
            setEnglishDetails(res.data.englishDetails);
            setFrenchDetails(res.data.frenchDetails);
            setUkrainianDetails(res.data.ukrainianDetails);
            let newArray = languagesCheckbox;
            if (res.data.polishDetails !== "") {
              newArray = newArray.map((lang) => {
                if (lang.name === "Polish") {
                  return { ...lang, checked: true };
                }
                return lang;
              });
            }
            if (res.data.englishDetails !== "") {
              newArray = newArray.map((lang) => {
                if (lang.name === "English") {
                  return { ...lang, checked: true };
                }
                return lang;
              });
            }
            if (res.data.frenchDetails !== "") {
              newArray = newArray.map((lang) => {
                if (lang.name === "French") {
                  return { ...lang, checked: true };
                }
                return lang;
              });
            }
            if (res.data.ukrainianDetails !== "") {
              newArray = newArray.map((lang) => {
                if (lang.name === "Ukrainian") {
                  return { ...lang, checked: true };
                }
                return lang;
              });
            }
            setLanguagesCheckbox(newArray);
          });
        } catch (error) {
          console.log(error);
        }
      }
      setLoadingPage(false);
    };

    fetchData();
  }, [id]);

  const convertToBase64OneFile = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAddedPhotos((prev) => {
        return [...prev, reader.result] as string[];
      });
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const convertToBase64 = (e: any) => {
    console.log(e.target.files);
    Array.from(e.target.files).forEach((element: any) => {
      convertToBase64OneFile(element);
    });
  };
  console.log(addedPhotos);
  return (
    <div className="AddPlace">
      <Header />
      {loadingPage ? (
        <div className="Spinner-container">
          <Spinner className="Spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Form className="AddPlace-form" onSubmit={handleAddPlace}>
          <h1>{t("AddYourPlace")}</h1>
          {error && <div className="Form-loginError">{t("AddPlaceError")}</div>}
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
              <Dropdown.Item onClick={() => setCityName("Szczecin")}>
                {t("Cities.Szczecin")}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setCityName("Katowice")}>
                {t("Cities.Katowice")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("Address")}</Form.Label>
            <Form.Control
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder={`${t("AddressPlaceholder")}`}
            />
          </Form.Group>

          <div key="inline-radio">
            <Form.Check
              inline
              label={`${t(`Types.Apartment`)}`}
              name="group1"
              type="radio"
              id="inline-radio-1"
              className="AddPlace-radio"
              onChange={() => setType("Apartment")}
              checked={type === "Apartment"}
              required
            />
            <Form.Check
              inline
              label={`${t(`Types.Couch`)}`}
              name="group1"
              type="radio"
              id="inline-radio-2"
              className="AddPlace-radio"
              onChange={() => setType("Couch")}
              checked={type === "Couch"}
            />
            <Form.Check
              inline
              name="group1"
              label={`${t(`Types.Room`)}`}
              type="radio"
              id="inline-radio-3"
              className="AddPlace-radio"
              onChange={() => setType("Room")}
              checked={type === "Room"}
            />
          </div>

          <div>
            <p>{t("SelectLanguages")}:</p>
            {triedToSubmit &&
              languagesCheckbox.every((el) => el.checked === false) && (
                <p className="AddPlace-addPhotosWarning">
                  {t("SelectLanguagesError")}
                </p>
              )}
            <div key="inline-checkbox">
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
                    onChange={() => handleChangeCheckbox(index)}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
          {languagesCheckbox[0].checked && (
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t("AddDetails.Polish")}:</Form.Label>
              <Form.Control
                required
                value={polishDetails}
                onChange={(e) => setPolishDetails(e.target.value)}
                as="textarea"
                rows={5}
              />
            </Form.Group>
          )}
          {languagesCheckbox[1].checked && (
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t("AddDetails.English")}:</Form.Label>
              <Form.Control
                required
                value={englishDetails}
                onChange={(e) => setEnglishDetails(e.target.value)}
                as="textarea"
                rows={5}
              />
            </Form.Group>
          )}
          {languagesCheckbox[2].checked && (
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t("AddDetails.French")}:</Form.Label>
              <Form.Control
                required
                value={frenchDetails}
                onChange={(e) => setFrenchDetails(e.target.value)}
                as="textarea"
                rows={5}
              />
            </Form.Group>
          )}
          {languagesCheckbox[3].checked && (
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t("AddDetails.Ukrainian")}:</Form.Label>
              <Form.Control
                required
                value={ukrainianDetails}
                onChange={(e) => setUkrainianDetails(e.target.value)}
                as="textarea"
                rows={5}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("PhoneNumber")}</Form.Label>
            <Form.Control
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
                if (regex.test(e.target.value)) {
                  console.log("not valid");
                }
              }}
              type="text"
              placeholder={`${t("PhoneNumberPlaceholder")}`}
            />
          </Form.Group>

          <h3>{t("Photos")}</h3>
          {triedToSubmit && addedPhotos.length === 0 && (
            <div className="AddPlace-addPhotosWarning">
              {t("PhotosWarning")}
            </div>
          )}
          <div className="AddPlace-photosContainer">
            <div className="AppPlace-addPhotos">
              <label className="AddPlace-label">
                <AiOutlineCloudUpload fontSize={24} />
                {t("Upload")}
                <input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => convertToBase64(e)}
                  multiple
                />
              </label>
            </div>
            {addedPhotos.length > 0 &&
              addedPhotos.map((link, index) => {
                return (
                  <div key={index} className="AddPlace-photoContainer">
                    <img className="AddPlace-photo" alt="place" src={link} />
                    <AiFillDelete
                      onClick={() => deletePhoto(link)}
                      className="AddPlace-deletePhoto"
                    />
                  </div>
                );
              })}
          </div>

          {loading ? (
            <Spinner className="Spinner" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Button className="Submit-button" type="submit">
              {t("Buttons.Add")}
            </Button>
          )}
        </Form>
      )}
    </div>
  );
}

export default AddPlacePage;
