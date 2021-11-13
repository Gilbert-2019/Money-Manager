import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuth } from "../context/authContext";

import { Box } from "@mui/system";
import DataTable from "./dataTable";
import { Fab, ListItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Container, Grid } from "@mui/material";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Form from "./form";
import CategoryBoxes from "./categoryBoxes";
import ProfileSection from "./profileSection";

const HomePage = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) {
      history.push("/");
      return;
    }
    /* other func if user is there */
    fetchData();
  }, [user, history]);

  const handleLoggedOut = async () => {
    await auth.signOut();
    history.push("/");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    // fetch data
    setLoading(true);
    const eventsRef = collection(db, "events");
    const queryData = query(eventsRef, orderBy("date", "desc"));
    const response = await getDocs(queryData);
    const tempData = response.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date,
    }));
    await setEvents(tempData);
    setLoading(false);
    await console.log(events);
  };

  const postData = async (state) => {
    // post data
    // console.log(state);
    await addDoc(collection(db, "events"), {
      ...state,
    });
    fetchData();
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Box py={20} className="headerBox" color="white"></Box>
      <Grid container justifyContent="center">
        <Grid item xs={10}>
          <Box p={2} mt={-30} mb={2} className="wrapper">
            <Container maxWidth="xl">
              <Container maxWidth="lg">
                <Grid container spacing={2}>
                  <Grid item xs={6} md={8}>
                    <ListItem>
                      <CategoryBoxes />
                    </ListItem>
                    <ListItem>
                      <DataTable events={events} />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ListItem>
                      <ProfileSection handleLoggedOut={handleLoggedOut} />
                    </ListItem>
                    <Box sx={{ "& > :not(style)": { m: 1 } }}>
                      <Fab
                        color="secondary"
                        className="addButton"
                        aria-label="add"
                      >
                        <AddIcon onClick={handleOpen} />
                      </Fab>
                    </Box>
                    <Form
                      open={open}
                      handleClose={handleClose}
                      postData={postData}
                    />
                  </Grid>
                </Grid>
              </Container>
            </Container>
          </Box>
        </Grid>
      </Grid>
      <img src="images/img1.png" alt="" className="homeImg" />
    </React.Fragment>
  );
};

export default HomePage;