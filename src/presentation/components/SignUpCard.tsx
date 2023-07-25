import React, { useState } from "react";
import "../css/SignUpSignIn.css";
import AuthChip from "./AuthChip";
import Alert from "./Alert";
import { Card, Button, Form, Input } from "antd";
import ErrorText from "./ErrorText";
import { LoadingOutlined } from "@ant-design/icons";
import firebase from '../../data/Firebase'

type myProps = {
  userData: (data: any) => void;
};
const SignUpCard: React.FC<myProps> = ({ userData }) => {
  const [isRes, setIsRes] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = () => {
    setIsRes(true);
    if (password.length < 6) {
      Alert.fire({
        icon: "error",
        title: "Password must be more than 6 characters",
      });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential: { user: any }) => {
          const user = userCredential.user;
          userData(user);
          setIsRes(false);
          Alert.fire({
            icon: "success",
            title: "Account has been successfully created",
          });
        })
        .catch((error: { message: any }) => {
          const errorMessage = error.message;
          Alert.fire({
            icon: "error",
            title: errorMessage,
          });
        });
    }
  };

  return (
    <Card className="main-card">
      <div className="main-box">
      <AuthChip title="Sign up" />
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
              { required: true, message: <ErrorText text="Please enter your Email!" /> }, 
              { type: "email", message:  <ErrorText text="Please enter valid email" />}
            ]}
            
          >
            <Input placeholder="Email Address" className="user-input" onChange={(e: any) => setEmail(e.target.value)} />
          </Form.Item>

          </div>
          
          <div className="user-box">
          <Form.Item
            name="password"
            rules={[{ required: true, message: <ErrorText text="Please input your password!" /> }, 
            { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 
            message: <ErrorText text="A password should contain a SPECIAL CHARACTER and A NUMBER" />}]}
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
                Sign up
            </Button>
            </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default SignUpCard;
