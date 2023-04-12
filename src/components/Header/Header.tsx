import React, { useState } from "react";
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

type DateRangeType = {
  startDate: Date;
  endDate: Date;
  key: string;
};

function Header() {
  //get language from i18t
  const [lang, setLang] = useState<string>("English");
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [date, setDate] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  return (
    <div className="Header">
      <div className="Header-upperpart">
        {/* router -> home */}
        <img src="/logo192.png" width="48px" alt="logo" />

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
          {/* add inicials and onClick */}
          <CgProfile className="Profile" fontSize={40} />
        </div>
      </div>
      <div className="Header-bottompart">
        {/* add translation */}
        <p className="Welcome-text"> Lorem ipsum dolor sit amet, consectetur</p>
        <p className="Welcome-paraghaph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam
        </p>
      </div>
      <div className="Header-search">
        <Dropdown>
          <Dropdown.Toggle className="Search-dropdown" id="dropdown-basic">
            Lorem ipsum
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>Lorem ipsum</Dropdown.Item>
            <Dropdown.Item>Lorem ipsum</Dropdown.Item>
            <Dropdown.Item>Lorem ipsum</Dropdown.Item>
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
    </div>
  );
}

export default Header;
