import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { getAllSpotsThunk, getOwnerAllSpotsThunk } from "../../../store/spots";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import SleepInnStyleCard from "./SleepInnStyleCard";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Rating,
} from "@mui/material";

import "./GetSpots.css";

export default function GetSpots({ ownerMode = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = Object.values(
    useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : []))
  );

  console.log("spots = ", spots);

  const sessionUser = useSelector((state) => state.session.user);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [hoveredSpotId, setHoveredSpotId] = useState(null);

  // Function to handle next image navigation
  const handleNextImage = (spotId, spotImagesLength) => {
    setCurrentImageIndex((prevState) => {
      console.log(`Current state for ${spotId}:`, prevState[spotId]);
      console.log(`Total images for ${spotId}:`, spotImagesLength);
      const newIndex = ((prevState[spotId] || 0) + 1) % spotImagesLength;
      console.log(`New Index for ${spotId}:`, newIndex);
      return { ...prevState, [spotId]: newIndex };
    });
  };

  // Function to handle previous image navigation
  const handlePrevImage = (spotId, spotImagesLength) => {
    setCurrentImageIndex((prevState) => {
      const newIndex =
        ((prevState[spotId] || 0) - 1 + spotImagesLength) % spotImagesLength;
      console.log(`Previous Image Index for spot ${spotId}: ${newIndex}`);
      return { ...prevState, [spotId]: newIndex };
    });
  };

  useEffect(() => {
    if (ownerMode) dispatch(getOwnerAllSpotsThunk());
    else dispatch(getAllSpotsThunk());
  }, [dispatch, ownerMode]);

  const spotsToDisplay =
    ownerMode && sessionUser
      ? spots.filter((spot) => spot.ownerId === sessionUser.id)
      : spots;
  const ownerSpots =
    ownerMode && sessionUser
      ? spots.filter((spot) => spot.ownerId === sessionUser.id)
      : 1;
  console.log("spotsToDisplay = ", spotsToDisplay);

  if (!spots || !spotsToDisplay) return null;

  return (
    <Box className="main-container" sx={{ padding: 2 }}>
      <Grid container spacing={4}>
        {spotsToDisplay.map((spot) => {
          const combinedImages = [
            spot.previewImage,
            ...spot.otherImages.map((image) => image.url),
          ];

          return (
            <Grid item xs={12} sm={6} md={4} key={spot.id}>
              <Card
                onMouseEnter={() => setHoveredSpotId(spot.id)}
                onMouseLeave={() => setHoveredSpotId(null)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  cursor: "pointer",
                  position: "relative",

                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "none",
                }}
                onClick={() => navigate(`/spots/${spot.id}`)}
              >
                {/* <Box sx={{ position: "relative", height: 200, width: "100%" }}> */}
                <CardMedia
                  component="img"
                  image={combinedImages[currentImageIndex[spot.id] || 0]}
                  alt={spot.name}
                  sx={{
                    height: 300,
                    // height: "100%",
                    // width: "100%",
                    borderRadius: "10px",
                  }}
                />
                {combinedImages.length > 1 && (
                  <>
                    <Button
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 32,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        color: "black",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        "&:hover": {
                          backgroundColor: "white",
                          opacity: 0.8,
                        },
                        padding: 0,
                        lineHeight: 0,
                        minWidth: 0,
                        visibility:
                          hoveredSpotId === spot.id ? "visible" : "hidden",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePrevImage(spot.id, combinedImages.length);
                      }}
                    >
                      &#10094;
                    </Button>
                    <Button
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 32,
                        transform: "translate(50%, -50%)",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        color: "black",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        "&:hover": {
                          backgroundColor: "white",
                          opacity: 0.8,
                        },
                        padding: 0,
                        lineHeight: 0,
                        minWidth: 0,
                        visibility:
                          hoveredSpotId === spot.id ? "visible" : "hidden",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleNextImage(spot.id, combinedImages.length);
                      }}
                    >
                      &#10095;
                    </Button>
                  </>
                )}
                {/* </Box> */}
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.primary"
                      noWrap
                      sx={{ fontWeight: "bold", wordBreak: "break-word" }}
                    >
                      {spot.city}, {spot.state}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: "bold", marginRight: "4px" }}
                      >
                        ★
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: "normal" }}
                      >
                        {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Box component="span" sx={{ fontWeight: "bold" }}>
                      ${spot.price}
                    </Box>
                    <Box
                      component="span"
                      sx={{ fontWeight: "normal", marginLeft: "4px" }}
                    >
                      night
                    </Box>
                  </Typography>
                </CardContent>

                {ownerMode && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/spots/edit/${spot.id}`)}
                      sx={{
                        minWidth: "90px",
                        height: "36px",
                        padding: "6px 16px",
                        color: "white",
                        backgroundImage:
                          "linear-gradient(to left, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
                        border: "none",
                        ":hover": {
                          opacity: 0.9,
                          backgroundImage:
                            "linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%)",
                        },
                      }}
                    >
                      Update
                    </Button>

                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={<DeleteSpot spotId={spot.id} />}
                      className="custom-delete-button"
                      style={{
                        minWidth: "90px",
                        height: "36px",
                        padding: "6px 16px",
                        color: "white",
                        backgroundColor: "grey",
                        border: "1px solid black",
                        marginTop: "18px",
                      }}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
