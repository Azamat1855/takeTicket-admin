import React, { useEffect, useState } from 'react'; 
import { GridComponent, ColumnsDirective, ColumnDirective,Page, Search, Inject, Toolbar } from '@syncfusion/ej2-react-grids'; 
 
import Header from '../../../Components/Header'; 
const Workers = () => { 
  const [worker, setWorker] = useState([]) 
 
  const requestWorker = async () => { 
    try { 
      const request = await fetch('https://iticket-reference-backend.onrender.com/api/v1/users/get-by-role?role=admin', { 
        method: 'GET', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTBiMmUwZDU0YTBlYjFjNjlkZjYwNiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MzgyMzkwNzIsImV4cCI6MTczODg0Mzg3Mn0.1q0lKZDKWGn2zvjCv78asI0tx-SHEqyzE6mkMKfDjtU`, 
        }, 
      }); 
      const response = await request.json(); 
      setWorker(response || []);  
    } catch (e) { 
      console.error('Error fetching users:', e); 
    } 
  } 
  useEffect(() => { 
    requestWorker() 
  }, []) 
 
  return ( 
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-base-100 rounded-3xl"> 
      <Header title="Worker" /> 
      <GridComponent 
        dataSource={worker} 
        allowPaging 
        allowSorting 
        toolbar={['Search']} 
        width= 'auto' 
      > 
        <ColumnsDirective> 
          {/* Ustun konfiguratsiyasi */} 
          <ColumnDirective field="_id" headerText="ID" width="150" textAlign="Center" /> 
          <ColumnDirective field="firstName" headerText="First Name" width="130" textAlign="Center" /> 
          <ColumnDirective field="lastName" headerText="Last Name" width="130" textAlign="Center" /> 
          <ColumnDirective field="email" headerText="Email" width="140" textAlign="Center" /> 
          <ColumnDirective field="phoneNumber" headerText="Phone Number" width="150" textAlign="Center" />
          <ColumnDirective field="role" headerText="Role" width="110" textAlign="Center" /> 
        </ColumnsDirective> 
        <Inject services={[Page, Search, Toolbar]} /> 
      </GridComponent> 
    </div> 
  ); 
}; 
export default Workers;