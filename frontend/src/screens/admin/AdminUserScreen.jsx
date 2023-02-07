import axios from 'axios';
import React from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import SideMenu from '../../components/SideMenu';
import {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { deleteUser } from '../../actions/userAction';
import { useDispatch } from 'react-redux';

const AdminUserScreen = () => {
  const [users, setUsers] = useState([])
  const dispatch = useDispatch();

  useEffect(()=>{
    const getUsers = async()=>{
      try {
       
        let config = {
          Headers: {
            'Content-Type': 'application/json',
            
          },
        };
        const { data } = await axios.get(
          '/api/users/profiles',
          config
        );
          setUsers(data)
        console.log(data)
       
        
       
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
       
      }
    }
    getUsers()
  }, [])

  
  
  return(
    <>
    <SideMenu/>
    <Container fluid className='pt-3'>
      <Row>
        <Col>
    <Table striped bordered hover>
  <thead>
    <tr>
      
      <th>Name</th>
      <th>Email</th>
                  <th>Admin</th>
                  <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user)=>(
      <tr key={user._id}>
      
      <td>{user.name}</td>
      <td>{user.email}</td>
        <td>{user.isAdmin.toString()}</td>
        <td> <Button
                          variant='danger'
                         
                          className='btn-sm mb-2'
                          onClick={() => {
                           dispatch(deleteUser(user._id));
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} onClick  />
                        
                        </Button></td>
    </tr>

    ))}
    
    
  </tbody>
</Table>
</Col>
</Row>
</Container>
    </>
  )
  

};

export default AdminUserScreen;
