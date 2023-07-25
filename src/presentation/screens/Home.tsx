import { Box, Button, Card, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Alert from "../components/Alert";
import firebase from '../../data/Firebase'
import CategoryTableView from "../components/CategoryTableView";
import { Tooltip } from "antd";
import { LogoutOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import '../css/home.css'
import pageRoutes from "../../routes/pageRoutes";
import Protected from "../components/Protected";

const Home = () => {

  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  const [info, setInfo] = useState<Array<any>>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");


  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();


  const styles= { 
    modalView: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: "center",
    
    },
    boxView: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: 5,
      backgroundColor: '#FFF',
      borderRadius: 5,
      cursor: 'pointer',
      boxShadow: '10px 10px 10px #888'
    }
  }

  const handleClick = async () => {
    if(!category.trim()){
        Alert.fire({
            icon: "error",
            title: "Field cannot be empty",
          });
    } else{
        const res: any = await fetch("https://guru-traders-d3c0c-default-rtdb.asia-southeast1.firebasedatabase.app/categories.json",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category
            }),
        }
        );
        if(res){
            Alert.fire({
                icon: "success",
                title: "Category has been successfully added !",
              });
              handleClose()
        } else{
            Alert.fire({
                icon: "error",
                title: "Something went wrong from our end, please try again !",
            });
        }
    }
  }

  useEffect(()=>{
    const email: any = localStorage.getItem("userData");
    setUserEmail(email);

    // Checking User isLoggedIn or not
    if(localStorage.getItem("userData")){
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }

    getCategories()
  },[])


  const getCategories = () => {
    const tableRef:any = firebase.database().ref('categories');
    tableRef.on('value', (snapshot: any) => {
      const tableData: any = snapshot.val();
      if(tableData){
        const dataArray: any = Object.values(tableData);
        setInfo(dataArray);
      } else{}
    });
  }

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        Alert.fire({
          icon: "success",
          title: "Logged out successfully",
        });
        localStorage.removeItem("userData");
        navigate(pageRoutes.AUTH);
      })
      .catch((error) => {
        Alert.fire({
          icon: "error",
          title: "Something went wrong",
        });
        console.error("Sign out error:", error);
      });
  };


  return (
    <Protected isLoggedIn={isLoggedIn}>
      <Card className="main-card">
        <div className="home-div">
          <Tooltip title="User Email">
          <div className="user-mail">Namaste, {userEmail} !
            <span></span>
          </div>
          </Tooltip>
          <Tooltip title='Logout' className="logoutBtn">
            <LogoutOutlined onClick={handleLogout} />
          </Tooltip>
        </div>

        <div style={{marginTop: 20}}>
        <Box sx={{padding: '10px 12px 50px 12px'}}>
     {info?.length > 0 ?  
    <CategoryTableView data={info} /> :
    
    <Box>
    <Typography variant="h2" paddingTop={3} fontFamily={'Ysabeau Office, sans-serif'} fontWeight={'bold'} letterSpacing={4} color={'#654'}>
      Guru Traders
    </Typography>
    <Card
      onClick={handleOpen}
      sx={styles.boxView}>
        <Typography
          fontSize={20}
          fontWeight={"bold"}
          fontFamily={"Ysabeau Office, sans-serif"}
          letterSpacing={2}
        >
          Add Category
        </Typography>
      <AddIcon color="warning" fontSize="large" />
    </Card>
    </Box>
    }

    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalView}>
          <Typography variant="h6" component="h2" mb={5} fontWeight={'bold'} fontFamily={'Ysabeau Office, sans-serif'}>
            Enter the Category here
          </Typography>
          <TextField size="small" placeholder="Enter here.." fullWidth value={category}
          onChange={(e: any)=>setCategory(e.target.value)}  autoComplete="off" autoCapitalize="on" />
          <Box>
            <Button variant="contained" color="warning" sx={{marginTop: 3, marginRight: 3}} onClick={handleClick}>Submit</Button>
            <Button color="warning" onClick={handleClose} sx={{marginTop: 3}}>Close</Button>
          </Box>
        </Box>
    </Modal>

    </Box>
      </div>    
      </Card>
    </Protected>
    
  );
};

export default Home;
