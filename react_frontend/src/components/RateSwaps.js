import axios from "axios";
import { useEffect, useState } from "react";
import {styles} from './styles';
import { useForm } from "react-hook-form";


export default function RateSwaps() {    

    const token = localStorage.getItem('accessToken');
    const email = JSON.parse(localStorage.getItem('email'));
    let [items, setItems] = useState([]);

    const { register } = useForm({    });
  


    if (!token) {
        window.location.href = "/";      
    }
   
    function viewUnratedSwaps(email) {
            axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ViewUnratedSwaps', {
                    params: {
                            email: email,
                    }
                }).then(function (response) {
                    // handle success
                    console.log(response.data);
                  
                    if(response.data.results.length >0){       
                        setItems(response.data.results);
                        
                    } else{
                        window.location.href = "/MainMenu";   
                    }               
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
        viewUnratedSwaps(email);        
    }, [email]);


   
    const handleChange = (item,e) => {

        console.log(item.AcceptenceDate);
        console.log(e.target.value);
        const email = JSON.parse(localStorage.getItem('email'));
    
               axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=UpdateRating", {
                 params: { 
                     ditem : item.desireditemnumber,
                     pitem : item.proposeditemnumber,
                     rating : e.target.value,
                     email : email,}

                   }).then(function (response) {          
             
                 console.log(response);
               
               })
               .catch(function (error) {
                 console.log(error);
                 
               });    
               
               viewUnratedSwaps(email); 
           };
       
       
     
    
    return (
        
    <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
  
          <div className='text-dark-blue-400 text-xl mb-3 font-semibold mb-4'>Rate Swaps</div>         
          <table className="table-auto border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>                        
                        <th className={styles.tablerow}>Acceptance Date</th>
                        <th className={styles.tablerow}>My Role</th>
                        <th className={styles.tablerow}>Proposed Item</th>
                        <th className={styles.tablerow}>Desired Item</th>
                        <th className={styles.tablerow}>Other User</th>
                        <th className={styles.tablerow}>Rating</th>
        
                 </tr>
                </thead>
                <tbody>

                {items.map((item, key) =>
                            <tr key={key}>
                                 <td className={styles.tablerow}>{item.AcceptenceDate}</td>
                                 <td className={styles.tablerow}>{item.MyRole}</td>
                                 <td className={styles.tablerow}>{item.ProposedItem}</td>
                                 <td className={styles.tablerow}>{item.DesiredItem}</td>                           
                                 <td className={styles.tablerow}>{item.OtherUser}</td>
                                 <td className={styles.tablerow}> 
                                       <select {...register("rating")} className={styles.select} onChange={(e) =>handleChange(item, e) } >
                                       <option value="-"></option>
                                       <option value="0">0</option>
                                       <option value="1">1</option>
                                       <option value="2">2</option>
                                       <option value="3">3</option>
                                       <option value="4">4</option>
                                       <option value="5">5</option>
                                        </select>                                 
                                 </td>    
                             </tr>
                     )}

                      
                </tbody>
            </table>
        </div>
    )
}