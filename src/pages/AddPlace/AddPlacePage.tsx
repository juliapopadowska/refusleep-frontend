import axios from "axios";
import React, { useState } from "react";
import { Button, Dropdown, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Header from "../../components/common/Header/Header";
import "./AddPlacePage.scss";
import { AiOutlineCloudUpload, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";

const languagesCheckboxInitial = [
  { name: "Polish", checked: false },
  { name: "English", checked: false },
  { name: "German", checked: false },
  { name: "Ukrainian", checked: false },
];

function AddPlacePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [address, setAddress] = useState("");
  const [polishDetails, setPolishDetails] = useState("");
  const [englishDetails, setEnglishDetails] = useState("");
  const [germanDetails, setGermanDetails] = useState("");
  const [ukrainianDetails, setUkrainianDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [cityName, setCityName] = useState("Warsaw");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [type, setType] = useState("");
  const [triedToSubmit, setTriedToSubmit] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [languagesCheckbox, setLanguagesCheckbox] = useState(
    languagesCheckboxInitial
  );

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
      try {
        setLoading(true);
        await axios.post("/api/apartments/add", {
          cityName,
          address,
          type,
          polishDetails,
          englishDetails,
          germanDetails,
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

  return (
    <div className="AddPlace">
      <Header />
      <Form className="AddPlace-form" onSubmit={handleAddPlace}>
        <h1>Add your place</h1>
        {error && <div className="Form-loginError">Lorem ipsum</div>}
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
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Enter address"
          />
        </Form.Group>

        <div key="inline-radio">
          <Form.Check
            inline
            label="Apartment"
            name="group1"
            type="radio"
            id="inline-radio-1"
            className="AddPlace-radio"
            onChange={() => setType("Apartment")}
            required
          />
          <Form.Check
            inline
            label="Couch"
            name="group1"
            type="radio"
            id="inline-radio-2"
            className="AddPlace-radio"
            onChange={() => setType("Couch")}
          />
          <Form.Check
            inline
            name="group1"
            label="Room"
            type="radio"
            id="inline-radio-3"
            className="AddPlace-radio"
            onChange={() => setType("Room")}
          />
        </div>

        <div>
          <p>Select languages that you know:</p>
          {triedToSubmit &&
            languagesCheckbox.every((el) => el.checked === false) && (
              <p className="AddPlace-addPhotosWarning">
                You need to select at least one language!
              </p>
            )}
          <div key="inline-checkbox">
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
                  onChange={() => handleChangeCheckbox(index)}
                  key={index}
                />
              );
            })}
          </div>
        </div>
        {languagesCheckbox[0].checked && (
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Add Details in Polish</Form.Label>
            <Form.Control
              required
              value={polishDetails}
              onChange={(e) => setPolishDetails(e.target.value)}
              as="textarea"
            />
          </Form.Group>
        )}
        {languagesCheckbox[1].checked && (
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Add Details in English</Form.Label>
            <Form.Control
              required
              value={englishDetails}
              onChange={(e) => setEnglishDetails(e.target.value)}
              as="textarea"
            />
          </Form.Group>
        )}
        {languagesCheckbox[2].checked && (
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Add Details in German</Form.Label>
            <Form.Control
              required
              value={germanDetails}
              onChange={(e) => setGermanDetails(e.target.value)}
              as="textarea"
            />
          </Form.Group>
        )}
        {languagesCheckbox[3].checked && (
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Add Details in Ukrainian</Form.Label>
            <Form.Control
              required
              value={ukrainianDetails}
              onChange={(e) => setUkrainianDetails(e.target.value)}
              as="textarea"
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Phone number</Form.Label>
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
            placeholder="Enter phone number"
          />
          {validPhone && (
            <Form.Control.Feedback>
              Enter valid phone number!
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <h3>Photos</h3>
        {triedToSubmit && addedPhotos.length === 0 && (
          <div className="AddPlace-addPhotosWarning">Add photos!</div>
        )}
        <div className="AddPlace-photosContainer">
          <div className="AppPlace-addPhotos">
            <label className="AddPlace-label">
              <AiOutlineCloudUpload fontSize={24} />
              Upload
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                style={{ display: "none" }}
                onChange={(e) => uploadPhoto(e)}
                multiple
              />
            </label>
          </div>
          {addedPhotos.length > 0 &&
            addedPhotos.map((link, index) => {
              return (
                <div key={index} className="AddPlace-photoContainer">
                  <img
                    className="AddPlace-photo"
                    alt="place"
                    src={`${process.env.REACT_APP_API_URL}/uploads/${link}`}
                  />
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
            Add
          </Button>
        )}
      </Form>
    </div>
  );
}

export default AddPlacePage;
