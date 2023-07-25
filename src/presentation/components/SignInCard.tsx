import { Link } from "@mui/material";
import React, { useState } from "react";
import "../css/SignUpSignIn.css";
import AuthChip from "./AuthChip";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import pageRoutes from "../../routes/pageRoutes";
import { Card, Space, Button, Form, Input, Typography } from "antd";
import ErrorText from "./ErrorText";
import { LoadingOutlined } from "@ant-design/icons";
import firebase from '../../data/Firebase'

const SignInCard = () => {
  const [isRes, setIsRes] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setIsRes(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential: { user: any }) => {
        const user = userCredential.user;
        Alert.fire({
          icon: "success",
          title: "Logged in successfully",
        });
        localStorage.setItem("userData", user?.email);
        navigate(pageRoutes.HOME);
      })
      .catch((error: { message: any }) => {
        const errorMessage = error.message;
        setIsRes(false);
        Alert.fire({
          icon: "error",
          title: errorMessage,
        });
      });
  };

  const handleForgetPass = () => {
    if(email.trim()){
      firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.fire({
          icon: "success",
          title: "Password reset email sent",
        });
      })
    } else{
      Alert.fire({
        icon: "error",
        title: 'Please enter email to proceed !',
      });
    }
   
  };

  return (
    <Card className="main-card">
      <div className="main-box">
        <AuthChip title="Sign in" />

          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleSubmit}
          >
            <div className="user-box">
              <Form.Item
                name="Email"
                rules={[
                  {
                    required: true,
                    message: <ErrorText text="Please enter your Email!" />,
                  },
                  {
                    type: "email",
                    message: <ErrorText text="Please enter valid email" />,
                  },
                ]}
              >
                <Input
                  placeholder="Email Address"
                  className="user-input"
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </Form.Item>
            </div>

            <div className="user-box">
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: <ErrorText text="Please input your password!" />,
                  },
                ]}
              >
                <Input
                  type="password"
                  placeholder="Password"
                  className="user-input"
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button icon={isRes ? <LoadingOutlined /> : null} htmlType="submit" className="submitBtn">
                Sign in
              </Button>
            </Form.Item>
          </Form>

        <Space style={{ margin: 1 }}>
          <Link onClick={handleForgetPass}>
            <Typography className="footerTxt">Forget Password ?</Typography>
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default SignInCard;
