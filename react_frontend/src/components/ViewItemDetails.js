import axios from "axios";
import {styles} from './styles';
import { useEffect, useState } from "react";
import { Link, useLocation  } from "react-router-dom";


function ViewItemDetails() {

  const location = useLocation();
  const itemdata = location.state?.itemdata;
  let [items, setItems] = useState([]);
  let [owner, setOwner] = useState([]);
  const email = JSON.parse(localStorage.getItem('email'));
  let [rating, setRating] = useState("");
  let [distance, setDistance] = useState("");
  let [isOwner, setIsOwner] = useState(false);
  let [isAvailableForSwapping, setIsAvailableForSwapping] = useState(false);

  const unaccepted = JSON.parse(localStorage.getItem('unaccepted'));
  const unrated = JSON.parse(localStorage.getItem('unrated'));
  let [distanceStyle, setDistanceStyle] = useState("");

  let [mytitle, setMytitle] = useState("");
  let [myitemnumber, setMyitemnumber] = useState("");

  useEffect(() => {
    axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ViewItemDetails', {
        params: {
                itemnumber: itemdata.itemnumber,
                email: email,
        }
      }).then(function (response) {
        // handle success
        console.log(response);  
        if(response.data.items){              
            setItems(response.data.items);
            setIsOwner(true); 
            setMytitle(response.data.items['0']['name']); 
            setMyitemnumber(response.data.items['0']['itemnumber']); 
            setIsAvailableForSwapping(response.data.items['0']['isAvailableForSwapping']);            
        }

        if(response.data.owner){ 
          setItems(response.data.owner);
          setOwner(response.data.owner);           
          setRating(response.data.rating);   
          setDistance(response.data.distance); 
          setMytitle(response.data.owner['0']['name']); 
          setMyitemnumber(response.data.owner['0']['itemnumber']);   
          setIsAvailableForSwapping(response.data.owner['0']['isAvailableForSwapping']);  
        }

        if(distance >0 &&  distance <=25 ) setDistanceStyle("bg-green-500");  
        if(distance >25 && distance <=50 ) setDistanceStyle("bg-yellow-300"); 
        if(distance >50 &&  distance <=100 ) setDistanceStyle("bg-orange-400");
        if(distance >100 ) setDistanceStyle("bg-red-500");   

    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });

}, [itemdata, email, distance]);

var myArray={ "distance": distance, "title": mytitle, "itemnumber": myitemnumber }; 

return (
<div>
<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
<div className='text-dark-blue-400 text-l mb-3 font-bold mt-2 mb-5'>Item Details</div>  
<div className="grid grid-cols-2 gap-4">

    <div>  
          {items.map((item, key ) =>
           <div key={key} className='grid grid-cols-4 gap-0'>
              <div className={item.itemnumber ? 'col-span-1 font-medium' : 'hidden'}> Item #</div> <div className={item.itemnumber ? 'col-span-3' : 'hidden'}>: {item.itemnumber} </div>
              <div className={item.name ? 'col-span-1 font-medium' : 'hidden'}> Title</div> <div className={item.name ? 'col-span-3' : 'hidden'}>: {item.name} </div>
              <div className={item.gametype ? 'col-span-1 font-medium' : 'hidden'}> Game type</div> <div className={item.gametype ? 'col-span-3' : 'hidden'}>: {item.gametype} </div>
              <div className={item.itemcondition ? 'col-span-1 font-medium' : 'hidden'}> Condition</div> <div className={item.itemcondition ? 'col-span-3' : 'hidden'}>: {item.itemcondition} </div>
              <div className={item.description ? 'col-span-1 font-medium' : 'hidden'}> Description</div> <div className={item.description ? 'col-span-3' : 'hidden'}>: {item.description} </div>
              <div className={item.platform ? 'col-span-1 font-medium' : 'hidden'}> Platform</div> <div className={item.platform ? 'col-span-3' : 'hidden'}>: {item.platform} </div>
              <div className={item.piececount ? 'col-span-1 font-medium' : 'hidden'}> Piececount</div> <div className={item.piececount ? 'col-span-3' : 'hidden'}>: {item.piececount} </div>
              <div className={item.platformname ? 'col-span-1 font-medium' : 'hidden'}> Platform </div> <div className={item.platformname ? 'col-span-3' : 'hidden'}>: {item.platformname} </div>
              <div className={item.media ? 'col-span-1 font-medium' : 'hidden'}> Media</div> <div className={item.media ? 'col-span-3' : 'hidden'}>: {item.media} </div>           
          
          </div>
          )}
    </div>
    <div>
           {owner.map((item, key ) =>
           <div key={key} className='grid grid-cols-4 gap-0'>
              <div className={item.nickname ? 'col-span-1 font-medium' : 'hidden'}> Offered by</div> <div className={item.nickname ? 'col-span-3' : 'hidden'}>: {item.nickname} </div>
              <div className={item.city ? 'col-span-1 font-medium' : 'hidden'}> Location</div> <div className={item.city ? 'col-span-3' : 'hidden'}>: {item.city}, {item.state} {item.postalcode}</div>
              <div className={rating ? 'col-span-1 font-medium' : 'hidden'}> Rating</div> <div className={rating ? 'col-span-3' : 'hidden'}>: {rating} </div>
              <div className={distance || distance !== 0 ? distanceStyle + ' col-span-1 font-medium' : 'hidden'}> Distance</div> 
              <div className={distance || distance !== 0 ? distanceStyle + ' col-span-3' : 'hidden'}>: {distance} miles</div>  
                         
           </div>
          )}  

          <div className='mt-5'> <Link to="/ProposeSwap" className={ (unrated <= 2 || unaccepted <= 5) && !isOwner && isAvailableForSwapping ? styles.button : 'hidden'} state={{ itemdata:myArray }} type="button">Propose Swap</Link></div>
    </div>
    

</div>
</div>



</div>
)}

export default ViewItemDetails;