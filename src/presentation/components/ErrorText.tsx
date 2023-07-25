import { Space, Typography } from 'antd'
import React from 'react'
import '../css/ErrorText.css'
import { FrownOutlined } from "@ant-design/icons";

type myProps = {
    text: string
}
const ErrorText: React.FC<myProps> = ({text}) => {
  return (
    <Space>
      <Typography className='errortxt'>
          {text}
      </Typography>
      <FrownOutlined style={{color: '#fff'}} />
    </Space>

  )
}

export default ErrorText