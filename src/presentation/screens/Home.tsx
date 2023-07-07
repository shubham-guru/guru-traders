import { Box, Button, Card, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Alert from "../components/Alert";
import firebase from 'firebase/compat/app'
import firebaseConfig from "../../data/Firebase";
import 'firebase/database';
import CategoryTableView from "../components/CategoryTableView";

const Home = () => {

  const [open, setOpen] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<string>('');
  const [info, setInfo] = React.useState<Array<any>>([]);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    getCategories()
  },[])

  const getCategories = () => {
    firebase.initializeApp(firebaseConfig);
    const tableRef:any = firebase.database().ref('categories');
    tableRef.on('value', (snapshot: any) => {
      const tableData: any = snapshot.val();
      if(tableData){
        const dataArray: any = Object.values(tableData);
        setInfo(dataArray);
      } else{}
    });
  }


  return (
    <Box>
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
  );
};

export default Home;
