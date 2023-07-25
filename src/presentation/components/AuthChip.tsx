import React from 'react'
import {AiTwotoneMail} from 'react-icons/ai'
import { Typography } from 'antd'
import '../css/AuthChip.css'

type myProps = {
    title: string
}
const AuthChip: React.FC<myProps> = ({title}) => {
  return (
    <div className='auth-chip'>
        <Typography className='auth-chip-text'>
            {title} using &nbsp;
        </Typography>
        <AiTwotoneMail />
    </div>
  )
}

export default AuthChip