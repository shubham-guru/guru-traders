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

type myProps = {
  data: Array<any>;
  category: string;
};
const ProductTabelView: React.FC<myProps> = ({ data, category }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [productQty, setProductQty] = useState<number>(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


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

  return (
    <Box>
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
            All Products of {category.toUpperCase()}
          </Typography>

          <Button
            variant="outlined"
            onClick={handleOpen}
            endIcon={<AddIcon />}
            color="warning"
          >
            Add Product
          </Button>
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
            <>
              <tr>
                <Card
                  key={index}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: ".4%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      width: "100%",
                      backgroundColor: "#fff",
                      margin: 2,
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
                      {item.name}
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
                      <IconButton>
                        <AddIcon color="warning" />
                      </IconButton>
                      <IconButton>
                        <RemoveIcon color="warning" />
                      </IconButton>
                      <IconButton>
                        <DeleteIcon color="warning" />
                      </IconButton>
                    </ButtonGroup>
                  </Box>
                  <Box></Box>
                </Card>
              </tr>
            </>
          );
        })}
      </table>

      <Modal open={open} onClose={handleClose}>
        <Card sx={styles.modalView}>
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
        </Card>
      </Modal>
    </Box>
  );
};

export default ProductTabelView;
