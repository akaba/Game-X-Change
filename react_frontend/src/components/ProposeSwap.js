import axios from "axios";
import { useEffect, useState } from "react";
import {styles} from './styles';
import { useLocation  } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdWarning } from "react-icons/md";
import { BsCheckCircle } from "react-icons/bs";






export default function ProposeSwap() {
 
   

    const token = localStorage.getItem('accessToken');
    const email = JSON.parse(localStorage.getItem('email'));
    let [items, setItems] = useState([]);

    const location = useLocation();
    const itemdata = location.state?.itemdata;
    
    let [proposeditem, setProposedItem] = useState("");
    let [success, setSuccess] = useState(false);
    

   


    if (!token) {
        window.location.href = "/";      
    }
   
    const { register,handleSubmit, formState: { errors } } = useForm({
        defaultValues: {   
        }
    });

    useEffect(() => {
        axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ProposeSwap', {
            params: {                    
                    email: email,
            }
          }).then(function (response) {
            // handle success
            console.log(response.data);
            setItems(response.data.data);
                
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    }, [email]);

    
  
    
    const handleChange = (item,e) => {
     setProposedItem(item.itemnumber);
    };

    
    const onSubmit = data => {

       // console.log(proposeditem);
       // console.log(desireditem);
       // console.log(email);

        axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=insertswap", {
            params: { 
                proposeditem: proposeditem,
                desireditem: itemdata.itemnumber,               
            }

              }).then(function (response) {          
        
            console.log(response);
          
          })
          .catch(function (error) {
            console.log(error);
            
          });

          setSuccess("Your swap has been proposed");





         

        
    



    } ;

    const dismissSuccess = () => {
        setSuccess("");
        window.location.href = "MainMenu"
      }  

   
    
        return (
        <div>
    <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-10'>

    { success && 
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>     
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" onClick={dismissSuccess}>
            <button><BsCheckCircle className="inline-block align-top"/> {success} </button>
        </div></div>                  
      }
      
        <div className='text-dark-blue-400 text-xl font-semibold mb-3'>Propose Swap</div>

        <div className="grid grid-cols-4 gap-0 mb-7">

        <div className={itemdata.distance >= 100 ? 'bg-red-500 text-xl col-span-4 font-medium m-4 px-20' : 'hidden'}> 
        <MdWarning className="inline-block text-2xl text-yellow-500"/> The other user is {itemdata.distance} miles away ! 
        <MdWarning className="inline-block text-2xl text-yellow-500"/></div>

        <div className="col-span-3">You are proposing a trade for: {itemdata.title}</div>      <div className="col-span-1"> <button onClick={handleSubmit(onSubmit)} className={styles.button}>Confirm Swap</button></div>
      
           
        </div>
        <div className="mb-4">Please choose your proposed item: </div> 

                <table className="table-auto border border-slate-400 w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"> 
                        <tr>                        
                           
                            <th className={styles.tablerow}> Item # </th>
                            <th className={styles.tablerow}> Game type </th>
                            <th className={styles.tablerow}> Title </th>
                            <th className={styles.tablerow}> Condition  </th>
                            <th className={styles.tablerow}> Proposed item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, key ) =>
                            <tr key={key}>
                               
                                     <td className={styles.tablerow}>{item.itemnumber}</td>
                                     <td className={styles.tablerow}>{item.gametype}</td>
                                     <td className={styles.tablerow}>{item.name}</td>
                                     <td className={styles.tablerow}>{item.itemcondition}</td>
                                     <td className={styles.tablerow}> <input type="radio" {...register("searchType")} onChange={(e) =>handleChange(item, e) }  />   </td>                   
                            </tr>
                        )} 
                    </tbody>
                </table>                 
        </div>
                
        </div>

                    


    )
}