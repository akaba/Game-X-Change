import axios from "axios";
import { useEffect, useState } from "react";
import {styles} from './styles';
import { Link  } from "react-router-dom";
import { useForm } from "react-hook-form";



export default function SwapHistoryForm() {
 
   

    const token = localStorage.getItem('accessToken');
    const email = JSON.parse(localStorage.getItem('email'));
    let [stats, setItems1] = useState([]);
    let [swaphistory, setItems2] = useState([]);

    if (!token) {
        window.location.href = "/";      
    }

    const { register } = useForm({
        defaultValues: {
         
        }
     });
    
   
    function SwapHistory(email){   
        axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=SwapHistory', {
            params: {
                    email: email,
            }
          }).then(function (response) {
            // handle success
            console.log(response.data);
            setItems1(response.data.stats);
            setItems2(response.data.history);                
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
        SwapHistory(email);        
    }, [email]);

    

    const handleChange = (item,e) => {

        console.log(item);
        console.log(e.target.value);
        const email = JSON.parse(localStorage.getItem('email'));
    
               axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=UpdateRating", {
                 params: { 
                     ditem : item.desireditemnumber,
                     pitem : item.proposeditemnumber,
                     rating : e.target.value,
                     email : email,
                    }

                   }).then(function (response) {          
             
                 console.log(response);
               
               })
               .catch(function (error) {
                 console.log(error);
                 
               });  
               
               
               SwapHistory(email); 

    };


    return (
        <div>
<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
  
    <div className='text-dark-blue-400 text-xl mb-3 font-semibold mb-4'>Swap History</div>
            <div className='text-dark-blue-400 text-l mb-3 font-semibold mb-1'></div>
            <table className="table-auto border border-slate-400 w-2/6 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>                        
            
                        <th className={styles.tablerow}>My Role</th>
                        <th className={styles.tablerow}>Total</th>
                        <th className={styles.tablerow}>Accepted</th>
                        <th className={styles.tablerow}>Rejected</th>
                        <th className={styles.tablerow}>Rejected%</th>
                    </tr>
                </thead>
                <tbody>
              
                    {stats.map((item,key) =>                
                        <tr key={key}>
                            <td className={styles.tablerow}>{item.MyRole}</td>
                            <td className={styles.tablerow}>{item.Total}</td>
                            <td className={styles.tablerow}>{item.Accepted}</td>
                            <td className={styles.tablerow}>{item.Rejected}</td>                           
                            <td className={item.Rejected_prec >=50 ? 'bg-red-500 '+ styles.tablerow : styles.tablerow}>{item.Rejected_prec}</td>                            
                        </tr>
                 
                       
                    )}
                    
                   </tbody>
            </table>    
          

           <div className='text-dark-blue-400 text-l mb-3 font-semibold mt-7 mb-1'></div>           
            <table className="table-auto border border-slate-400 w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>                        
                       
                        <th className={styles.tablerow}>Proposed Date </th>
                        <th className={styles.tablerow}>Accepted/ Rejected Date </th>
                        <th className={styles.tablerow}>Swap Status </th>
                        <th className={styles.tablerow}>My Role </th>
                        <th className={styles.tablerow}>Proposed Item </th>
                        <th className={styles.tablerow}>Desired Item </th>
                        <th className={styles.tablerow}>Other User </th>
                        <th className={styles.tablerow}>Rating </th>
                        <th className={styles.tablerow}> </th>
                    </tr>
                </thead>
                <tbody>
                    {swaphistory.map((item, key ) =>
                        <tr key={key}>
                           
                                 <td className={styles.tablerow}>{item.proposeddate}</td>
                                 <td className={styles.tablerow}>{item.statusdate}</td>
                                 <td className={styles.tablerow}>{item.swapstatus}</td>
                                 <td className={styles.tablerow}>{item.MyRole}</td>
                                 <td className={styles.tablerow}>{item.ProposedItem}</td>                           
                                 <td className={styles.tablerow}>{item.DesiredItem}</td>   
                                 <td className={styles.tablerow}>{item.OtherUser}</td>

                                

                                 <td className={styles.tablerow}>{ item.swapstatus ==="rejected" ? "" :  item.Rating !== null ? item.Rating: 
                                 <select {...register("rating")} className={styles.select} onChange={(e) =>handleChange(item, e) } >
                                    <option value="-"></option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                 
                                 }</td>    
                                 <td className={styles.tablerow}>                  
                                <Link to="/SwapDetails" state={{ itemdata:item }} className={styles.link}>Detail</Link>
                                 </td>                         
                        </tr>
                    )} 
                    

                    
                </tbody>
            </table>                 
</div>

</div>
    )
}

   
   