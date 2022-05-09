import axios from "axios";
import {styles} from './styles';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ViewMyItems() {

    const email = JSON.parse(localStorage.getItem('email'));
    let [itemCounts, setItemCounts] = useState([]);
    let [items, setItems] = useState([]);
    let [itemTotal, setItemTotal] = useState("");
    
    useEffect(() => {
        axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ViewMyItems', {
            params: {
                    email: email,
            }
          }).then(function (response) {
            // handle success
            console.log(response);

            if(response.data.success){
                setItemCounts(response.data.counts);    
                setItems(response.data.items);      
                let sum = 0;
                response.data.counts.forEach(value => {
                    sum += value.count;
                });
                setItemTotal(sum);
            }


        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    }, [email]);
   

  
    return (
        <div>
<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
  
    <div className='text-dark-blue-400 text-xl mb-3 font-semibold mb-4'>My Items that are available for swapping</div>
            <div className='text-dark-blue-400 text-l mb-3 font-semibold mb-1'>Item Counts</div>
            <table className="table-auto border border-slate-400 w-2/6 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>                        
                        <th className={styles.tablerow}>Game Type</th>
                        <th className={styles.tablerow}>Count</th>
                    </tr>
                </thead>
                <tbody>
              
                    {itemCounts.map((item,key) =>                
                        <tr key={key}>
                            <td className={styles.tablerow}>{item.gametype}</td>
                            <td className={styles.tablerow}>{item.count} </td>                            
                        </tr>
                 
                       
                    )}
                        <tr >
                            <td className={styles.tablerow}>TOTAL</td>
                            <td className={styles.tablerow}>{itemTotal}</td>                            
                        </tr>
                    
                   </tbody>
            </table>    
          

           <div className='text-dark-blue-400 text-l mb-3 font-semibold mt-7 mb-1'>My Items</div>           
            <table className="table-auto border border-slate-400 w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>                        
                        <th className={styles.tablerow}>Item #</th>
                        <th className={styles.tablerow}>Game Type</th>
                        <th className={styles.tablerow}>Title</th>
                        <th className={styles.tablerow}>Condition</th>
                        <th className={styles.tablerow}>Description</th>                   
                        <th className={styles.tablerow}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, key ) =>
                        <tr key={key}>
                            
                            <td className={styles.tablerow} >{item.itemnumber}</td>
                            <td className={styles.tablerow}>{item.gametype}</td>                         
                            <td className={styles.tablerow}>{item.name}</td> 
                            <td className={styles.tablerow}>{item.itemcondition}</td>                           
                            <td className={styles.tablerow}>
                            {item.description!= null && item.description.length >100 ? item.description.slice(0, 100)+"..." : item.description }
                            </td>
                            <td className={styles.tablerow}>                  
                                <Link to="/ViewItemDetails" state={{ itemdata:item }} className={styles.link}>Detail</Link>

                              

                            </td>
                                                   
                        </tr>
                    )} 
                    

                    
                </tbody>
            </table>                 
</div>

   

        </div>
    )
}

export default ViewMyItems;