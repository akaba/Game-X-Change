import axios from "axios";
import { useEffect, useState } from "react";
import {styles} from './styles';
import { BsCheckCircle } from "react-icons/bs";
import { Link } from "react-router-dom";



export default function AcceptRejectSwaps() {
 
   

    const token = localStorage.getItem('accessToken');
    const email = JSON.parse(localStorage.getItem('email'));
    let [items, setItems] = useState([]);
    let [success, setSuccess] = useState(false)
    let [successName, setSuccessName] = useState("");
    let [successEmail, setSuccessEmail] = useState("");
    let [successPhone, setSuccessPhone] = useState("");
    let [successShowPhone, setSuccessShowPhone] = useState(false);
    


    if (!token) {
        window.location.href = "/";      
    }
   

    function viewunacceptedswaps(email) {
          axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=viewunacceptedswaps', {
            params: {
                    email: email,
            }
          }).then(function (response) {
            // handle success
            console.log(response.data.data);

            if(response.data.data.length >0){ 
              setItems(response.data.data);              
          } else{

             //if(success) 
             window.location.href = '/MainMenu';        
         
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
      viewunacceptedswaps(email);
    }, [email]);


    const accept = (item,e) => {

        console.log(item);       
    
               axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=acceptrejectswap", {
                 params: { 
                     ditem : item.desireditemnumber,
                     pitem : item.proposeditemnumber,
                     desicion: 'accepted',
                     }

                   }).then(function (response) {          
             
                 console.log(response); 
                 setSuccess(true);
                 setSuccessName("Name: " + item.proposerFirstname);
                 setSuccessEmail("Email: " + item.proposerEmail);
                 setSuccessPhone("Phone: "+ item.ProposeruserPhoneNumber + "("+ item.ProposeruserPhoneType+ ")");
                 setSuccessShowPhone(item.ProposeruserShowPhone);
                 // viewunacceptedswaps(email);
               
               })
               .catch(function (error) {
                 console.log(error);                 
               });    
              


           };



           const reject = (item,e) => {

            console.log(item);
          
        
                   axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=acceptrejectswap", {
                     params: { 
                         ditem : item.desireditemnumber,
                         pitem : item.proposeditemnumber,
                         desicion: 'rejected',
                         }
    
                       }).then(function (response) {          
                 
                     console.log(response);
                     viewunacceptedswaps(email);
                   
                   })
                   .catch(function (error) {
                     console.log(error); 
                     
                   });   
                
                   
               };

               const dismissSuccess = () => {
                setSuccess(false);
                viewunacceptedswaps(email);
               
              }

    

    
             
    
    return (
        
  <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>

      { success && 
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>     
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" onClick={dismissSuccess}>
        <div><BsCheckCircle className="inline-block"/> Swap Accapted !</div>
        <div> Contact the proposer to swap items!</div>
        <div> </div>  
        <div> {successName}</div>
        <div> {successEmail}</div>
        <div > {successPhone && successShowPhone ? successPhone : ''}  
               {successPhone && !successShowPhone ? 'No phone number available': ''}
         </div> 
        
        <div> </div>        
        <button className={styles.button}> OK </button>
        </div></div>               
      }

{!success &&   <div>
  <div className='text-dark-blue-400 text-xl mb-3 font-semibold mb-4'>Accept/reject swaps</div>     
   
          <table className="table-auto border border-slate-800 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                 
                  <tr>                  
                        <th className={styles.tablerow}>Date</th>
                        <th className={styles.tablerow}>Desired Item</th>
                        <th className={styles.tablerow}>Proposer</th>
                        <th className={styles.tablerow}>Rating</th>
                        <th className={styles.tablerow}>Distance</th>
                        <th className={styles.tablerow}>Proposed Item</th>
                        <th className={styles.tablerow}></th>

                 </tr>
                </thead>
                <tbody>

                {items.map((item, key) =>
                            <tr key={key}>
                                 <td className={styles.tablerow}>{item.date}</td>
                                 <td className={styles.tablerow}>
                                 <Link to="/ViewItemDetails" state={{ itemdata:{"itemnumber": item.desireditemnumber}  }} className={styles.link}>{item.desireditem}</Link>
                                 </td>
                                 <td className={styles.tablerow}>{item.proposer}</td>                                     
                                 <td className={styles.tablerow}>{item.rating}</td>     
                                 <td className={styles.tablerow}>{item.distance} miles</td>  
                                 <td className={styles.tablerow}>
                                 <Link to="/ViewItemDetails" state={{ itemdata:{"itemnumber": item.proposeditemnumber}  }} className={styles.link}>{item.proposeditem}</Link>
                                 </td>  
                                 <td className={styles.tablerow}>

                                 <button className={styles.button} onClick={(e) =>accept(item, e) }> Accept </button> &nbsp;
                                 <button className={styles.button} onClick={(e) =>reject(item, e) }> Reject </button>

                                </td>   
                         </tr>
                     )}
     
                </tbody>
            </table>
            </div>}       

        </div>
  

            
    )
}