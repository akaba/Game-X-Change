import React, { useState, useEffect }  from 'react';
import {  Routes, Route, Link, useLocation  } from "react-router-dom";
import { GiCardExchange } from "react-icons/gi";
import { GoSignOut } from "react-icons/go";
import { FaUserEdit } from "react-icons/fa";
import {styles} from './components/styles';
import Login from "./components/Login";
import Register from "./components/Register";
import MainMenu from "./components/MainMenu";
import ListNewItem from "./components/ListNewItem.js";
import ViewMyItems from "./components/ViewMyItems.js";
import ViewItemDetails from "./components/ViewItemDetails.js";
import SearchItems from "./components/SearchItems.js";
import UpdateInfo from "./components/UpdateInfo.js";
import RateSwaps from "./components/RateSwaps.js";
import SwapHistory from "./components/SwapHistory.js";
import SwapDetails from "./components/SwapDetails.js";
import ProposeSwap from "./components/ProposeSwap.js";
import AcceptRejectSwaps from "./components/AcceptRejectSwaps.js";





function App() {  

  const [showBTN, setShowBTN] = useState(false); 
  const [showEditProfile, setShowEditProfile] = useState(false); 

  const token = localStorage.getItem('accessToken');
  const location = useLocation();
 
  useEffect(() => {
    // Update the document title using the browser API
    if (token) {
      setShowBTN(true);
    }

    if (location.pathname === '/MainMenu') {
      setShowEditProfile(true);
    }  

  }, [token, location]);

  function logout() {
      localStorage.clear();    
      window.location.href = "/";
  }  
  function editProfile() {
   // alert('onEditProfile');
   window.location.href = "/UpdateInfo";
  }

   
  return (    
       


<div className={` ${!showBTN ? 'bg-gray-400' : 'App container mx-auto mt-3 font-thin'}`}>

{ showBTN &&
    <div className="flex mx-auto mt-3 font-thin bg-blue-600 text-white"> 

      
        <div className="w-9/12 text-3xl ml-10 mb-2">  
          <Link to="/MainMenu">  <GiCardExchange className="inline-block"/> Game Swap </Link> 
        </div>       

        <div className="flex w-3/12 rounded-md shadow-sm">
        
        { showEditProfile && 
           <button type="button" onClick={editProfile} className={styles.buttonGroup1} >
            <FaUserEdit className="inline-block"/> Update Profile </button> 
        }
          
           <button type="button" onClick={logout} className={styles.buttonGroup1} >
            <GoSignOut className="inline-block"/> Log out </button>     
        </div>
    </div>     
}   

    <div className={`rounded-lg overflow-hidden border border-1 border-r px-3 py-10 flex justify-center ${showBTN ? 'bg-gray-200' : ''}`}>
              
        <Routes> 
          <Route path="/" element={<Login/>} /> 
          <Route path='Register' element={<Register/>} /> 
          <Route path='MainMenu' element={<MainMenu/>} />
          <Route path='ListNewItem' element={<ListNewItem/>} />
          <Route path='ViewMyItems' element={<ViewMyItems/>} />
          <Route path='ViewItemDetails' element={<ViewItemDetails/>} />          
          <Route path='SearchItems' element={<SearchItems/>} />  
          <Route path='UpdateInfo' element={<UpdateInfo/>} /> 
          <Route path='RateSwaps' element={<RateSwaps/>} /> 
          <Route path='SwapHistory' element={<SwapHistory/>} /> 
          <Route path='SwapDetails' element={<SwapDetails/>} /> 
          <Route path='ProposeSwap' element={<ProposeSwap/>} />
          <Route path='AcceptRejectSwaps' element={<AcceptRejectSwaps/>} />
          
          


            
        </Routes>         
    
    </div>
    <p className="text-center text-gray-500 text-xm">&copy; Gatech - Team 083 - CS6400 Spring 2022.</p>      
</div>
       
  );
}


export default App;