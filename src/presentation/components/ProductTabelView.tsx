import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Alert from "./Alert";
import actions from "../../domain/Actions";
import { Input } from 'antd';
import firebase from '../../data/Firebase';

type myProps = {
  data: Array<any>;
  category: string;
};
const ProductTabelView: React.FC<myProps> = ({ data, category }) => {
  const { Search } = Input;
  const [open, setOpen] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [productQty, setProductQty] = useState<number>(0);
  const [updatedValue, setUpdatedValue] = useState<number>(0);
  const [action, setAction] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const handleOpen = (value: string, name: string) => {
    setOpen(true);
    setAction(value);
    setSelectedName(name);
    setProductName('')
    setProductQty(0)
  };
  const handleClose = () => {
    setOpen(false)
    setUpdatedValue(0)
  }

  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.fire({
        icon: "error",
        title: "Field cannot be empty",
      });
    } else {
      const res: any = await fetch(
        `https://guru-traders-d3c0c-default-rtdb.asia-southeast1.firebasedatabase.app/products/${category}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: productName,
            quantity: productQty,
            category: category,
          }),
        }
      );
      if (res) {
        Alert.fire({
          icon: "success",
          title: "Product has been successfully added !",
        });
        handleClose();
      } else {
        Alert.fire({
          icon: "error",
          title: "Something went wrong from our end, please try again !",
        });
      }
    }
  };

  const updateQty = (action: string, value: any, name: string) => {
    const tableRef = firebase.database().ref('products/'+category);
    tableRef.once("value",  (snapshot: any) => {
    const tableData = snapshot.val()
    if(tableData){  
      updateRemoteObj(tableData, action, value, name)
          tableRef.update(tableData)
          .then(() => {
            Alert.fire({
              icon: "success",
              title: "Quantity updated successfully",
            });
            handleClose()      
        })
          .catch((error) => {
            Alert.fire({
              icon: "error",
              title: "Something went wrong",
            });      
          });   
    }
    });
  }

  const updateRemoteObj = (tableData: any, action: string, value: any, name: string) => {
    Object.keys(tableData).forEach((item)=>{
      if(action === actions.ADD && tableData[item].name === name) {
        var updatedQty = parseInt(tableData[item].quantity);
        var updatedVal = parseInt(value);
        Object.assign(tableData[item], { quantity: JSON.stringify(updatedQty + updatedVal) })
      } 
      else if(action === actions.MINUS && tableData[item].name === name) {
        var tempValue = parseInt(tableData[item].quantity) - parseInt(value)
        var finalValue = tempValue < 0 ? 0 : tempValue
        Object.assign(tableData[item], { quantity: JSON.stringify(finalValue) })
      } 
      else if(action === actions.DELETE && tableData[item].name === name){
          Object.assign(tableData, [item])
      }
    })
    return tableData
  }

  const deleteProduct = (deleteProduct: string) => {
    const tableRef = firebase.database().ref("products/"+category);
    tableRef.once("value",  (snapshot: any) => {
    const tableData = snapshot.val()
    if(tableData){
      var deletedId = updateRemoteObj(tableData, action, null, deleteProduct)[0]
      const newRef = firebase.database().ref("products/"+category+'/'+deletedId)
          newRef.remove()
          .then(() => {
            Alert.fire({
              icon: "success",
              title: "Product deleted successfully",
            });
            handleClose()      
        })
          .catch((error) => {
            Alert.fire({
              icon: "error",
              title: "Something went wrong",
            });      
          });   
    }
    });    
  }
  const styles = {
    modalView: {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  const handleSearch = () => {
    var a: Array<any> = [];
    Object.values(data).forEach((key)=>{
      console.log(Object.values(key).includes(searchText))
    });
  }
  
  return (
    <Box sx={{backgroundColor: 'antiquewhite'}}>
      <table width="100%">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 30,
              letterSpacing: 2,
              textDecoration: "underline",
              color: "#434",
              fontFamily: "Belanosima, sans-serif",
            }}
          >
            All Products of {category?.toUpperCase()}
          </Typography>

          <Button
            variant="outlined"
            onClick={() => handleOpen("","")}
            endIcon={<AddIcon />}
            color="warning"
          >
            Add Product
          </Button>
        </div>
        <div style={{margin: 10}}>
          <Search placeholder="search product..." onChange={(e)=> setSearchText(e.target.value)} enterButton="Search" onSearch={handleSearch} size="large" />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <th style={{ width: "33.33%" }}>Product Name</th>
          <th style={{ width: "33.33%" }}>Quantity</th>
          <th style={{ width: "33.33%" }}>Actions</th>
        </div>

        {data?.map((item, index) => {
          return (
              <tr key={index}>
                <Card
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "1%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      width: "100%",
                      backgroundColor: "#fff",
                      padding: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Ysabeau Office, sans-serif",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        padding: 1,
                        letterSpacing: 2,
                      }}
                    >
                      {item?.name?.toUpperCase()}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "Ysabeau Office, sans-serif",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        padding: 1,
                        letterSpacing: 2,
                      }}
                    >
                      {item.quantity} units
                    </Typography>
                    <ButtonGroup
                      variant="outlined"
                      size="small"
                      aria-label="outlined button group"
                    >
                      <IconButton onClick={() => handleOpen(actions.ADD, item.name)}>
                        <AddIcon color="warning" />
                      </IconButton>

                      <IconButton onClick={() => handleOpen(actions.MINUS, item.name)}>
                        <RemoveIcon color="warning" />
                      </IconButton>
                      <IconButton onClick={()=> handleOpen(actions.DELETE, item.name)}>
                        <DeleteIcon color="warning" />
                      </IconButton>
                    </ButtonGroup>
                  </Box>
                  <Box></Box>
                </Card>
              </tr>
          );
        })}
      </table>

      <Modal open={open} onClose={handleClose}>
        <Card sx={styles.modalView}>
          {action === actions.ADD || action === actions.MINUS ? (
            <Box>
                <Typography variant="h5" textAlign={'center'} marginBottom={3} fontFamily={'Belanosima, sans-serif'}>{action} Quantity</Typography>
                <TextField
                type="tel"
                size="small"
                autoComplete="off"
                value={updatedValue}
                onChange={(e: any) => setUpdatedValue(e.target.value)}
                />

                <Box>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ marginTop: 3, marginRight: 3 }}
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ marginTop: 3, marginRight: 3 }}
                  onClick={()=>updateQty(action, updatedValue, selectedName)}
                >
                  update
                </Button>
                </Box>

            </Box>
          ) : 
            action === actions.DELETE ? (
              <Box>
                <Typography variant="h5" textAlign={'center'} marginBottom={3} fontFamily={'Belanosima, sans-serif'}>{action} Product</Typography>
                <Typography fontFamily={'Ysabeau Office, sans-serif'} fontWeight={'bold'}>Are you sure you want to delete this product</Typography>
                <Typography fontFamily={'Ysabeau Office, sans-serif'} fontWeight={'bold'} textAlign={'center'}>This action cannot be undone !</Typography>

                <Box sx={{textAlign: 'center'}}>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ marginTop: 3, marginRight: 3 }}
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ marginTop: 3, marginRight: 3 }}
                  onClick={()=>deleteProduct(selectedName)}
                >
                  Yes, delete
                </Button>
                </Box>

            </Box>
            ) 
            :
          (
            <div style={{textAlign: 'center'}}>
              <TextField
                size="small"
                label="Product Name"
                fullWidth
                value={productName}
                sx={{ marginBottom: 4 }}
                onChange={(e: any) => setProductName(e.target.value)}
                autoComplete="off"
                autoCapitalize="on"
              />
              <TextField
                type="tel"
                size="small"
                label="Quantity"
                fullWidth
                value={productQty}
                onChange={(e: any) => setProductQty(e.target.value)}
                autoComplete="off"
                autoCapitalize="on"
              />

              <Box>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ marginTop: 3, marginRight: 3 }}
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ marginTop: 3, marginRight: 3 }}
                  onClick={handleSubmit}
                >
                  Add Product
                </Button>
              </Box>
            </div>
          )}
        </Card>
      </Modal>
    </Box>
  );
};

export default ProductTabelView;
