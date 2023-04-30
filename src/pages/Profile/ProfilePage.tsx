import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import { AiOutlinePlus } from "react-icons/ai";
import "./ProfilePage.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Apartment, User } from "../../types";
import Place from "../../components/common/Place/Place";
import { MdModeEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>();
  const [places, setPlaces] = useState<Apartment[]>([]);
  const [editNameMode, setEditNameMode] = useState(false);
  const [newUserName, setNewUserName] = useState<string>(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/profile", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data);
          setNewUserName(response.data.name);
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
    fetchProfileData();

    const fetchPlaces = async () => {
      try {
        setLoadingPlaces(true);
        const response = await axios.get("/api/users/user-places", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setPlaces(response.data);
        }
        setLoadingPlaces(false);
      } catch (error) {
        setLoadingPlaces(false);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    };

    fetchPlaces();
  }, []);

  const handleSubmitNewName = (e: any) => {
    e.preventDefault();
    if (user) {
      const { _id } = user;
      axios.put("/api/users/profile", { id: _id, name: newUserName }).then(() =>
        axios.get("/api/users/profile").then((res) => {
          setUser(res.data);
          setNewUserName(res.data.name);
        })
      );
    }
    setEditNameMode(false);
    setNewUserName(user?.name || "");
  };

  return (
    <div>
      <Header />
      {loading || loadingPlaces ? (
        <div className="Spinner-container">
          <Spinner className="Spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="Profile-container">
          {user && (
            <>
              {" "}
              <Link to="/addPlace">
                <Button className="Profile-addButton">
                  <AiOutlinePlus /> {t("Buttons.AddPlace")}
                </Button>
              </Link>
              <div>
                <h3>{t("UserInformation")}</h3>
                <div className="Profile-nameText">
                  <span className="Profile-text">{t("Name")}:</span>
                  {editNameMode ? (
                    <Form
                      className="Profile-form"
                      onSubmit={handleSubmitNewName}
                    >
                      <Form.Group>
                        <Form.Control
                          value={newUserName}
                          type="text"
                          placeholder={`${t("NamePlaceholder")}`}
                          onChange={(event) =>
                            setNewUserName(event.target.value)
                          }
                        />
                      </Form.Group>
                      <Button className="Submit-button" type="submit">
                        {t("Buttons.Submit")}
                      </Button>
                    </Form>
                  ) : (
                    <>
                      {user?.name}
                      <MdModeEdit
                        className="Profile-editIcon"
                        onClick={() => setEditNameMode(true)}
                        fontSize={20}
                      />
                    </>
                  )}
                </div>
                <div>
                  <span className="Profile-text">{t("Email")}</span>{" "}
                  {user?.email}
                </div>
              </div>
            </>
          )}

          {places.length > 0 && (
            <div className="Profile-placesContainer">
              <h3>{t("YourPlaces")}</h3>
              <div className="Profile-places">
                {places.map((place, index) => {
                  return (
                    <Place key={index} apartment={place} homepage={false} />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      {error && (
        <Alert className="alert" variant="danger">
          {t("ServerError")}
        </Alert>
      )}
    </div>
  );
}

export default ProfilePage;
