import React, { useState,useEffect }  from 'react';
import {styles} from './styles';
import axios from "axios";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";

export default function MainMenuForm() {
 
    let [error, setError] = useState(false);
    let [rating, setRating] = useState("");
    let [days, setDays] = useState("");
    let [unaccepted, setUnaccepted] = useState("");
    let [unrated, setUnrated] = useState("");
  
  //  let [unaccepted_RedAndBold, setUnaccepted_RedAndBold] = useState(false);
  //  let [unrated_RedAndBold, setUnrated_RedAndBold] = useState(false);

    const token = localStorage.getItem('accessToken');
    const fullname = JSON.parse(localStorage.getItem('fullname'));
    const email = JSON.parse(localStorage.getItem('email'));

    if (!token) {
        window.location.href = "/";      
    }
   

    useEffect(() => {
        axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ViewMainMenu', {
            params: {
                    //action: 'ViewMainMenu',
                    email: email,
            }
          }).then(function (response) {
            // handle success
            console.log(response);
            setRating(response.data.rating);
            setDays(response.data.days);
            setUnaccepted(response.data.unaccepted);
            setUnrated(response.data.unrated); 
            localStorage.setItem('unaccepted', JSON.stringify(response.data.unaccepted));
            localStorage.setItem('unrated', JSON.stringify(response.data.unrated));

          //  if (days > 5 || unaccepted > 5 ) {
           //     setUnaccepted_RedAndBold(true);
          //  }                  
          //  if ( unrated > 2 ) setUnrated_RedAndBold(true);
                
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    }, [days, email, unaccepted, unrated]);
    

 

   
    
  
      


    const dismissError = () => {
        setError("");
    }    

    function listItem() {
        window.location.href = "ListNewItem";
    }
    
    function myItems() {
        window.location.href = "ViewMyItems";
    }

    function searchItems() {
        window.location.href = "SearchItems";
    } 

    function swapHistory() {
        window.location.href = "SwapHistory";
    }


    return (  
        <div className={styles.form}>  
        { error &&
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" onClick={dismissError}>
            <button type="button" onClick={dismissError}><VscError className="inline-block text-red-400 align-top"/> {error} </button>
        </div>                  
        }  
        <h2 className='text-dark-blue-400 text-2xl font-semibold mb-3'>Main Menu</h2>
        <h2 className='text-dark-blue-400 text-1xl font-medium mb-5'>Welcome, {fullname} ! </h2> 

        <div className='grid grid-cols-2 gap-3'>

            <div className='row-span-4 py-2 px-4 bg-transparent rounded border-2 border-slate-500 border-double content-center text-center text-medium'>

<div className="flex flex-row mb-2 py-2 px-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <div className="mb-1 py-1 px-1 text-1xl text-gray-900"> My Rating</div>
    <div className="mb-1 py-1 px-1 text-gray-700 font-semibold"> {rating}</div>
</div>

<div className="mb-2 py-2 px-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <div className={`text-1xl text-gray-900  ${ days > 5 || unaccepted > 5 ? 'font-bold text-red-500' : 'text-blue-600'}`} >
    <Link to="/AcceptRejectSwaps" className={unaccepted > 0 ? 'underline hover:text-blue-800' : 'hidden'}> {unaccepted} </Link>
    <div className={unaccepted === 0 ? '':'hidden'}> {unaccepted} </div> 
    </div>
    <div className="text-gray-700"> Unaccepted Swaps </div>
</div>

<div className="mb-2 py-2 px-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <div className={`text-1xl text-gray-900  ${ unrated > 2 ? 'font-bold text-red-500 ' : 'text-blue-600'} `} >  
        <Link to="/RateSwaps" className={unrated > 0 ? 'underline hover:text-blue-800' : 'hidden'}> {unrated} </Link>
        <div className={unrated === 0 ? '':'hidden'}> {unrated} </div> 
    </div>
    <div className="text-gray-700"> Unrated Swaps  </div>
</div>


            </div>

            <button onClick={listItem} className={styles.button} type="button"> List Item</button> 
            <button onClick={myItems} className={styles.button} type="button"> My Items</button> 
            <button onClick={searchItems} className={styles.button} type="button"> Search Items</button>       
            <button onClick={swapHistory} className={styles.button} type="button"> Swap History</button>

        </div>
   
           
        

        
      
        </div>
        
    );
}