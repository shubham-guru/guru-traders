import { Box, Button, Card, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import CategorySharpIcon from '@mui/icons-material/CategorySharp';
import AddIcon from "@mui/icons-material/Add";
import Alert from "./Alert";
import {useNavigate} from "react-router-dom"
import pageRoutes from "../../routes/pageRoutes";

type myProps = {
  data: Array<any>;
};
const CategoryTableView: React.FC<myProps> = ({ data }) => {

  const navigate = useNavigate()
  const [open, setOpen] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<string>('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const addProduct = (index: number, name: string) => {
    navigate(pageRoutes.ADD_PRODUCTS, { state: { index: index, name: name } })
  };
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

  const handleSubmit = async () => {
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
  
  return (
    <Box>
      <table width="100%" style={{ textAlign: "left", }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 30,
              letterSpacing: 2,
              textDecoration: "underline",
              color: "#434",
              fontFamily: 'Belanosima, sans-serif'
            }}
          >
            All Categories
          </Typography>
          <Button variant="outlined" onClick={handleOpen} endIcon={<AddIcon />} color="warning">Add Category</Button>
          </div>

        {data?.map((item, index) => {
          return (
            <>
              <tr>
                <Card
                  key={index}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: ".4%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "#fff",
                      margin: 2,
                    }}
                  >
                    <KeyboardDoubleArrowRightIcon color="warning" />
                    <Typography
                      sx={{
                        fontFamily: "Ysabeau Office, sans-serif",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        padding: 1,
                        letterSpacing: 2,
                      }}
                    >
                      {(item.category).toUpperCase()}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      size="small"
                      color="warning"
                      endIcon={<CategorySharpIcon />}
                      sx={{ width: "200px" }}
                      onClick={() => addProduct(index, item.category)}
                    >
                      Products
                    </Button>
                  </Box>
                </Card>
              </tr>
            </>
          );
        })}

      </table>

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
            <Button variant="contained" color="warning" sx={{marginTop: 3, marginRight: 3}} onClick={handleSubmit}>Submit</Button>
            <Button color="warning" onClick={handleClose} sx={{marginTop: 3}}>Close</Button>
          </Box>
        </Box>
    </Modal>

    </Box>
  );
};

export default CategoryTableView;
