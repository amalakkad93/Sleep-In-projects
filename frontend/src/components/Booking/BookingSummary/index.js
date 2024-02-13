import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingsForSpot, createBooking } from "../../../store/bookings";
import { useModal } from "../../../context/Modal";
import { addDays, isAfter } from 'date-fns';
import DatePicker from "../DatePicker/DatePicker";
import DateSelection from "../DatePicker/DateSelection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "./BookingSummary.css";

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent, setOnModalClose } = useModal();

  const {
    spot = {},
    selectedDates: initialDates,
    spotId,
  } = location.state || {};

  const existingBookings = useSelector((state) =>
    Object.values(state.bookings.bookingsForSpot)
  );

  const [selectedDates, setSelectedDates] = useState(initialDates);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [paymentOption, setPaymentOption] = useState("payInFull");

  const checkInDate = selectedDates
    ? new Date(selectedDates.startDate).toLocaleDateString()
    : "N/A";
  const checkOutDate = selectedDates
    ? new Date(selectedDates.endDate).toLocaleDateString()
    : "N/A";

  const startDate = new Date(selectedDates.startDate);
  const endDate = new Date(selectedDates.endDate);
  let totalNights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  totalNights = Math.max(totalNights, 1);
  const totalPrice =
    spot && spot.price ? (spot.price * totalNights).toFixed(2) : "N/A";

  const downPaymentPercentage = 0.2;
  const monthlyPayment = totalPrice / 12;

  const calculatedTotalPrice = Number(totalPrice);
  const initialPayment = calculatedTotalPrice * downPaymentPercentage;
  const remainingPayment = calculatedTotalPrice - initialPayment;
  const monthlyPaymentOption = calculatedTotalPrice / 12;


  useEffect(() => {
    if (spot.id) {
      dispatch(fetchBookingsForSpot(spot.id)).then(() => {
        console.log("Bookings fetched");
      });
    }
  }, [spot.id, dispatch]);


  const handleEditDatesClick = () => {
    const bookedDates = existingBookings.reduce((acc, booking) => {
      let currentDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      while (currentDate <= endDate) {
        if (isAfter(currentDate, new Date())) {
          acc.push(currentDate.toISOString().split('T')[0]);
        }
        currentDate = addDays(currentDate, 1);
      }

      return acc;
    }, []);

    setModalContent(
      <DateSelection
        initialStartDate={selectedDates.startDate}
        initialEndDate={selectedDates.endDate}
        onDatesSelected={({ startDate, endDate }) => {
          setSelectedDates({ startDate, endDate });
        }}
        bookedDates={bookedDates}
      />
    );
  };

  // const confirmBooking = async () => {
  //   const newBooking = {
  //     spotId: spot.id,
  //     startDate: selectedDates.startDate,
  //     endDate: selectedDates.endDate,
  //   };

  //   try {
  //     await dispatch(createBooking(spot.id, newBooking));

  //     setIsConfirmed(true);

  //     console.log("Booking confirmed:", isConfirmed);
  //   } catch (error) {
  //     if (!error.ok) {
  //       const errorData = await error.json(); // Convert the error response into JSON

  //       // Construct an error message from the response
  //       let errorMessage =
  //         errorData.message || "Failed to confirm booking. Please try again.";
  //       if (errorData.errors) {
  //         // Extract and concatenate all error messages
  //         const detailedErrors = Object.values(errorData.errors).join(". ");
  //         errorMessage += ` ${detailedErrors}`;
  //       }
  //       setBookingError(errorMessage);
  //     } else {
  //       // Handle unexpected errors
  //       setBookingError("An unexpected error occurred. Please try again.");
  //     }
  //   }
  // };
  const confirmBooking = async () => {
    const newBooking = {
      spotId: spot.id,
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
    };

    try {
      await dispatch(createBooking(spot.id, newBooking));
      setIsConfirmed(true);
      // Show confirmation modal
      setModalContent(
        <div>
          <p>Your booking is confirmed!</p>
          <button onClick={() => navigateToBookingHistory()}>OK</button>
        </div>
      );
    } catch (error) {
      handleBookingError(error);
    }
  };

  const navigateToBookingHistory = () => {
    // Close the modal if needed
    // Navigate to the user's booking history page
    navigate('/user/bookings');
  };

  const handleBookingError = async (error) => {
    if (!error.ok) {
      const errorData = await error.json();
      let errorMessage = errorData.message || "Failed to confirm booking. Please try again.";
      if (errorData.errors) {
        const detailedErrors = Object.values(errorData.errors).join(". ");
        errorMessage += ` ${detailedErrors}`;
      }
      setBookingError(errorMessage);
    } else {
      setBookingError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <h1
        className="request-to-book-header"
        onClick={() => navigate(`/spots/${spot.id}`)}
      >
        <FontAwesomeIcon icon={faAngleLeft} className="icon-back" />
        Request to book
      </h1>

      <div className="content">
        <div className="left-column">
          <h2>Your trip</h2>
          <div className="dates">
            <div className="dates-header">
              <h3>Dates</h3>
              <span onClick={handleEditDatesClick} className="edit-dates-text">
                Edit
              </span>
            </div>
            <div className="dates-display">
              <p>
                {checkInDate} - {checkOutDate}
              </p>
            </div>
          </div>

          <div className="payment-options">
            <h3>Choose how to pay</h3>

            {/* Pay in Full */}
            <div
              className={`payment-option ${
                paymentOption === "payInFull" ? "selected" : ""
              }`}
              onClick={() => setPaymentOption("payInFull")}
            >
              <div className="option-label-input">
                <label htmlFor="payInFull">Pay in full</label>
                <p>Pay the total (${calculatedTotalPrice.toFixed(2)}).</p>
              </div>
              <input
                type="radio"
                id="payInFull"
                name="paymentMethod"
                value="payInFull"
                checked={paymentOption === "payInFull"}
                onChange={() => {}}
                className="radio-input"
              />
            </div>

            {/* Pay Part Now, Part Later */}
            <div
              className={`payment-option ${
                paymentOption === "partPayment" ? "selected" : ""
              }`}
              onClick={() => setPaymentOption("partPayment")}
            >
              <div className="option-label-input">
                <label htmlFor="partPayment">
                  Pay part now, part later with Airbnb
                </label>
                <p>
                  ${initialPayment.toFixed(2)} due today, $
                  {remainingPayment.toFixed(2)} on Feb 22, 2024. No extra fees.
                </p>
              </div>
              <input
                type="radio"
                id="partPayment"
                name="paymentMethod"
                value="partPayment"
                checked={paymentOption === "partPayment"}
                onChange={() => {}}
                className="radio-input"
              />
            </div>

            {/* Pay Monthly with Klarna */}
            <div
              className={`payment-option ${
                paymentOption === "klarnaPayment" ? "selected" : ""
              }`}
              onClick={() => setPaymentOption("klarnaPayment")}
            >
              <div className="option-label-input">
                <label htmlFor="klarnaPayment">Pay monthly with Klarna</label>
                <p>
                  From ${monthlyPayment.toFixed(2)} per month for 12 months.
                  Interest may apply.
                </p>
              </div>
              <input
                type="radio"
                id="klarnaPayment"
                name="paymentMethod"
                value="klarnaPayment"
                checked={paymentOption === "klarnaPayment"}
                onChange={() => {}}
                className="radio-input"
              />
            </div>
          </div>
          {isConfirmed ? (
            <div className="confirmation-message">
              Your booking is confirmed!
            </div>
          ) : (
            <button onClick={confirmBooking} className="confirm-booking-btn">
              Request to book
            </button>
          )}
          {bookingError && (
            <div className="booking-error-message">{bookingError}</div>
          )}
        </div>

        <div className="right-column">
          <h2>Booking Summary</h2>

          <div className="spot-summary-section">
            <div className="spot-image-container">
              {spot.SpotImages && spot.SpotImages.length > 0 ? (
                <img
                  src={spot.SpotImages[0].url}
                  alt="Spot"
                  className="spot-image"
                />
              ) : (
                <div>No Image Available</div>
              )}
            </div>
            <div className="spot-info">
              <h3>{spot.name || "Spot name not available"}</h3>
              <p>
                {spot.city
                  ? `${spot.city}, ${spot.state}, ${spot.country}`
                  : "Location not available"}
              </p>

              <p>
                ★ {spot.avgStarRating?.toFixed(1) || "New"} (
                {spot.numReviews || 0} reviews)
              </p>
            </div>
          </div>

          <div className="price-details">
            <h3>Price Details</h3>

            {totalNights > 0 && (
              <>
                <p>
                  ${spot.price?.toFixed(2)} x {totalNights} nights
                </p>
                <p>Total (USD): ${totalPrice}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;