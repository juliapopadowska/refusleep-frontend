import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import "./ProfilePage.scss";

function ProfilePage() {
  return (
    <div>
      <Header />
      <Link to="/addPlace">
        <Button className="Profile-addButton">Add Place</Button>
      </Link>
    </div>
  );
}

export default ProfilePage;
