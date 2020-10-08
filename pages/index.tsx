import Login  from './login';
import React from 'react';


class Home extends React.Component {

  render = () => <div style={{width:"100%", height:"100%", margin:"0"}}>
          <Login />
        </div> 
}

export default Home;