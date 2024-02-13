import React from 'react';
import { useDispatch } from 'react-redux';
import { clearBooking } from '../../../store/bookings';

const ClearBooking= ({ bookingId, onClearSuccess }) => {
  const dispatch = useDispatch();

  const handleClearBooking = async () => {
    await dispatch(clearBooking(bookingId));
    onClearSuccess();
  };

  return (
    <button onClick={handleClearBooking} className="clear-booking-btn">
      Clear
    </button>
  );
};

export default ClearBooking;
