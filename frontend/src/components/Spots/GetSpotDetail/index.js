import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetailThunk } from "../../../store/spots";
import { fetchBookingsForSpot } from "../../../store/bookings";
import { getAllReviewsThunk } from "../../../store/reviews";
import OpenModalButton from "../../OpenModalButton";
import GetAllReviewsModal from "../../Reviews/GetAllReviewsModal/GetAllReviewsModal";
import PhotoGalleryModal from "../PhotoGalleryModal";
import CreateReviewModal from "../../Reviews/CreateReviewModal/CreateReviewModal";
import DatePicker from "../../Booking/DatePicker/DatePicker";

import "./GetSpotDetail.css";

export default function SpotDetail() {
  const navigate = useNavigate();
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const spot = useSelector((state) =>
    state.spots.singleSpot ? state.spots.singleSpot : null
  );
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) =>
    state.reviews.reviews.spot ? state.reviews.reviews.spot : null
  );
  const userSpotReview = sessionUser
    ? Object.values(reviews).find(
        (currentReview) => currentReview.userId === sessionUser.id
      )
    : {};
  const bookingsForSpot = useSelector((state) =>
    Object.values(state.bookings.bookingsForSpot)
  );

  // Function to calculate total price based on selected dates and spot price
  const calculateTotalPrice = () => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(
      Math.abs((selectedDates.endDate - selectedDates.startDate) / oneDay)
    );
    return spot.price * diffDays;
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getSpotDetailThunk(spotId));
    dispatch(getAllReviewsThunk(spotId)).finally(() => setLoading(false));
  }, [dispatch, spotId, reloadPage]);

  useEffect(() => {
    dispatch(fetchBookingsForSpot(spotId));
  }, [dispatch, spotId]);

  if (!spot || !spot.id) return null;
  if (!spot || !spot.id || !spot.SpotImages || spot.SpotImages.length === 0) {
    return null;
  }
  return (
    <>
      <div className="tile-parent">
        <div className="name-Location-container">
          <h1>{spot.name}</h1>
          <span className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
        </div>

        <div className="spot-images-container">
          <div className="left-spot-image-container">
            <img
              className="resize left-rounded"
              src={spot?.SpotImages[0]?.url}
              alt={spot?.name}
            />
          </div>

          {/* <div className="right-spot-image-container">
            {spot.SpotImages?.slice(1, 5).map((image, index, array) => (
              <div
                className={`right-image ${
                  index === 1 ? "top-right-rounded" : ""
                } ${index === array.length - 1 ? "bottom-right-rounded" : ""}`}
                key={index}
              >
                <img
                  className="resize"
                  src={image.url}
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
          </div> */}

          <div className="right-spot-image-container">
            {spot.SpotImages?.slice(1, 5).map((image, index, array) => (
              <div
                className={`right-image ${
                  index === 0 ? "top-right-rounded" : ""
                } ${index === array.length - 1 ? "bottom-right-rounded" : ""}`}
                key={index}
              >
                <img
                  className="resize"
                  src={image.url}
                  alt={`Image ${index + 1}`}
                />

                {index === array.length - 1 && spot.SpotImages.length > 5 && (
                  <>
                    <button
                      type="button"
                      className="show-all-photos-button"
                      onClick={() => setIsGalleryModalOpen(true)}
                    >
                      Show all photos
                    </button>
                    <PhotoGalleryModal
                      isOpen={isGalleryModalOpen}
                      images={spot.SpotImages}
                      closeModal={() => setIsGalleryModalOpen(false)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="details-container">
          <div className="ownner-details-and-description-container">
            <h2 className="ownner-details">
              {/* {" "} */}
              Hosted by, {spot.User && spot.User.firstName}{" "}
              {spot.User && spot.User.lastName}
            </h2>
            <div>
              {" "}
              <p className="p-tag-same-font">{spot.description}</p>
            </div>
          </div>

          <div className="callout-information-box">
            <div className="price-rating-numberOfReviews-container">
              <p className="price-p-tag">
                <span className="spot-price">${spot.price}</span> night
              </p>
              <p className="avgRating-numberOfReviews-p-tag">
                <span className="avgRating-numberOfReviews-span">
                  {/* ★ {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : <span className="boldText">New</span>} */}
                  ★{" "}
                  {spot.avgStarRating !== null &&
                  spot.avgStarRating !== undefined ? (
                    spot.avgStarRating.toFixed(1)
                  ) : (
                    <span className="boldText">New</span>
                  )}
                  {spot.numReviews > 0 && (
                    <>
                      {" "}
                      · {spot.numReviews}
                      <span className="grey-text">
                        {spot.numReviews === 1 ? " review" : " reviews"}
                      </span>
                    </>
                  )}
                </span>
              </p>
            </div>
            <div className="date-selection">
              <DatePicker
                onDateSelect={setSelectedDates}
                existingBookings={bookingsForSpot}
              />
            </div>

            <button
              className="reserve-btn"
              type="button"
              onClick={() => {
                // alert("Feature Coming Soon...")
                const totalPrice = calculateTotalPrice();

                navigate(`/booking-summary/${spotId}`, {
                  replace: true,
                  state: { spot, selectedDates, totalPrice },
                });
              }}
            >
              Reserve
            </button>
          </div>
        </div>
        <hr></hr>
        <div className="review-and-post-Review-button">
          <h2 className="avgRating-numofReviews">
            ★{" "}
            {spot.avgStarRating !== null && spot.avgStarRating !== undefined ? (
              spot.avgStarRating.toFixed(1)
            ) : (
              <span className="boldText">New</span>
            )}
            {spot.numReviews > 0 &&
              ` · ${spot.numReviews} ${
                spot.numReviews === 1 ? "review" : "reviews"
              }`}
          </h2>

          {!userSpotReview && spot.User.id !== sessionUser.id && (
            <OpenModalButton
              className="post-delete-review-btn"
              buttonText="Post Your Review"
              modalComponent={
                <CreateReviewModal
                  spotId={spot.id}
                  setReloadPage={setReloadPage}
                />
              }
            />
          )}
        </div>

        <GetAllReviewsModal spot={spot} setReloadPage={setReloadPage} />
      </div>
    </>
  );
}
