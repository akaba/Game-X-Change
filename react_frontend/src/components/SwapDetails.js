import axios from "axios";
import { useEffect, useState } from "react";
import {styles} from './styles';
import { useLocation  } from "react-router-dom";
import { useForm } from "react-hook-form";



export default function SwapDetails() {
 
   
    const location = useLocation();
    const itemdata = location.state?.itemdata;
    const token = localStorage.getItem('accessToken');
    const email = JSON.parse(localStorage.getItem('email'));
    let [swap, setItems1] = useState([]);
    let [otheruser, setItems2] = useState([]);
    let [pitem, setItems3] = useState([]);
    let [ditem, setItems4] = useState([]);
    let [distance, setDistance] = useState("");
    let [swapStatus, setSwapStatus] = useState("");



    if (!token) {
        window.location.href = "/";      
    }

    const { register } = useForm({
        defaultValues: {
         
        }
    });
   
    function ViewSwapDetails(email,itemdata){  
    
        axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ViewSwapDetails', {
            params: {
                    proposeditem: itemdata.proposeditemnumber,
                    desireditem: itemdata.desireditemnumber,
                    OtherUserEmail: itemdata.OtherUserEmail,
                    email: email,
            }
          }).then(function (response) {
            // handle success
            console.log(response.data);
            setItems1(response.data.swap);
            setItems2(response.data.otheruser);
            setItems3(response.data.pitem);
            setItems4(response.data.ditem);
            setDistance(response.data.distance);
            setSwapStatus(response.data.swap['0']['status']);
    
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }



    useEffect(() => {

        ViewSwapDetails(email,itemdata);

    }, [email,itemdata]);



    const handleChange = (itemdata,e) => {
    
               axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=UpdateRating", {
                 params: { 
                     ditem : itemdata.desireditemnumber,
                     pitem : itemdata.proposeditemnumber,
                     rating : e.target.value,
                     email : email,
                    }

                   }).then(function (response) {          
             
                 console.log(response);
               
               })
               .catch(function (error) {
                 console.log(error);
                 
               });  
               
               
             ViewSwapDetails(email,itemdata);

    }


   

   
    
    return (
        
        <div>
        <div className='bg-white shadow-md rounded px-4 pt-4 pb-8 mb-4'>

        <div className="grid grid-cols-2 gap-2">
        
            <div>  
                  {swap.map((item, key ) =>                 
                   <div key={key} className='grid grid-cols-4 mt-5'>
                      <div className='col-span-4 text-dark-blue-400 text-0 mb-0 font-bold mt-0 mb-0'>Swap Details</div> 
                      <div className={item.proposed ? 'col-span-1 font-medium' : 'hidden'}> Proposed </div> <div className={item.proposed ? 'col-span-3' : 'hidden'}>: {item.proposed} </div>
                      <div className={item.statusdate ? 'col-span-1 font-medium' : 'hidden'}> Accepted/rejected  </div> <div className={item.statusdate ? 'col-span-3' : 'hidden'}>: {item.statusdate} </div>
                      <div className={item.status ? 'col-span-1 font-medium' : 'hidden'}> Status </div> <div className={item.status ? 'col-span-3' : 'hidden'}>: {item.status} </div>
                      <div className={item.myrole ? 'col-span-1 font-medium' : 'hidden'}> My Role </div> <div className={item.myrole ? 'col-span-3' : 'hidden'}>: {item.myrole} </div>
                      <div className={item.status !=="rejected" ? 'col-span-1 font-medium' : 'hidden'}> Rating </div> 
                      <div className={item.status !=="rejected" ? 'col-span-3' : 'hidden'}>{item.status !=="rejected" && item.ratingleft !== null ? ': '+ item.ratingleft :
                        <select {...register("rating")} className={styles.select}  onChange={(e) =>handleChange(item, e) } >
                                    <option value=""></option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                        </select>
                        }                     
                      
                       </div>  


                    </div>
                  )}
            </div>           
            <div>   
        
                  {otheruser.map((item, key ) =>
                   <div key={key} className='grid grid-cols-4 mt-5'>
                      <div className='col-span-4 text-dark-blue-400 text-0 mb-0 font-bold mt-0 mb-0'>User Details </div> 
                      <div className={item.nickname ? 'col-span-1 font-medium' : 'hidden'}> Nickname </div> <div className={item.nickname ? 'col-span-3' : 'hidden'}>: {item.nickname} </div>
                      <div className={distance ? 'col-span-1 font-medium' : 'hidden'}> Distance  </div> <div className={distance ? 'col-span-3' : 'hidden'}>: {distance} miles </div>
                     
                    
                      <div className={swapStatus  === 'accepted' && item.firstname ? 'col-span-1 font-medium' : 'hidden'}> Name </div> <div className={swapStatus  === 'accepted' && item.firstname ? 'col-span-3' : 'hidden'}>: {item.firstname} </div>
                      <div className={swapStatus  === 'accepted' && item.email ? 'col-span-1 font-medium' : 'hidden'}> Email </div> <div className={swapStatus  === 'accepted' && item.email ? 'col-span-3' : 'hidden'}>: {item.email} </div>
                      <div className={swapStatus  === 'accepted' && item.phonenumber && item.showphone ? 'col-span-1 font-medium' : 'hidden'}> Phone </div> <div className={swapStatus  === 'accepted' && item.phonenumber && item.showphone ? 'col-span-3' : 'hidden'}>: {item.phonenumber} ({item.phonetype}) </div>
                    

                     
                   </div>
                  )}

            </div>        
            <div>  
                  {pitem.map((item, key ) =>
                   <div key={key} className='grid grid-cols-4 mt-5'>
                      <div className='col-span-4 text-dark-blue-400 text-0 mb-0 font-bold mt-0 mb-0'>Proposed Item</div> 

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
                  {ditem.map((item, key ) =>
                   <div key={key} className='grid grid-cols-4 mt-5'>
                    <div className='col-span-4 text-dark-blue-400 text-0 mb-0 font-bold mt-0 mb-0'>Desired Item</div>

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
        
        </div>
        </div>
        
        
        </div>

    )
}