import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

const Rating = ({ rating, text }) => {
  let ratings = [1, 2, 3, 4, 5];
  return (
    <>
      {ratings.map((value) =>
        value <= rating ? (
          <FontAwesomeIcon key={value} icon={faStar} />
        ) : value-0.5   === rating ? (
          <FontAwesomeIcon key={value} icon={faStarHalfStroke} />
        ) : (
          <FontAwesomeIcon key={value} icon={farStar} />
        )
      )}
      {text && <span>{text}</span>}
    </>
  );
};

export default Rating;
