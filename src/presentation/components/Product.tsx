import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Box, Card, TextField, Typography, Button } from "@mui/material";
import Alert from "./Alert";
import firebase from "firebase/compat/app";
import firebaseConfig from "../../data/Firebase";
import "firebase/database";
import ProductTabelView from "./ProductTabelView";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useNavigate} from "react-router-dom"
import pageRoutes from "../../routes/pageRoutes";


const Product = () => {
  const [productName, setProductName] = useState<string>("");
  const [productQty, setProductQty] = useState<number>(0);
  const [info, setInfo] = useState<Array<any>>([{}]);

  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async () => {

    if (!productName.trim()) {
      Alert.fire({
        icon: "error",
        title: "Fields cannot be empty",
      });
    } else {
      const res: any = await fetch(
        `https://guru-traders-d3c0c-default-rtdb.asia-southeast1.firebasedatabase.app/products/${location.state.name}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
           name: productName,
          quantity: productQty,
          category: location.state.name,
          }),
        }
      );
      if (res) {
        Alert.fire({
          icon: "success",
          title: "Product has been successfully added !",
        });
      } else {
        Alert.fire({
          icon: "error",
          title: "Something went wrong from our end, please try again !",
        });
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

 
  const getProducts = () => {
    firebase.initializeApp(firebaseConfig);
    const tableRef = firebase.database().ref('products/'+location.state.name);
    tableRef.on("value", (snapshot: any) => {
      const tableData = snapshot.val();
      if(tableData){
        const dataArray = Object.values(tableData);
        setInfo(dataArray);
      } else {}
    });
  };


  return (
    <Box>
      <KeyboardBackspaceIcon sx={{ float: "left", margin: 2, cursor: 'pointer' }} onClick={()=>navigate(pageRoutes.HOME)} />
     { (Object.keys(info[0]).length)  ? <ProductTabelView data={info} category={location.state.name} /> :  <Box sx={{ paddingTop: 3, height: '100vh' }}>
        <Typography
          variant="h5"
          fontFamily={"Belanosima, sans-serif"}
          color={"#434"}
          letterSpacing={2}
        >
          <u>Add Products in {location.state.name.toUpperCase()} Category</u>
        </Typography>


        <Card sx={{ width: 500, padding: 3, margin: "100px auto" }}>
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
          <Button
            variant="contained"
            color="warning"
            sx={{ marginTop: 3, marginRight: 3 }}
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </Card>
      </Box>}
    </Box>
  );
};

export default Product;
