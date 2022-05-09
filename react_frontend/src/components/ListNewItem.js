import React, { useState }  from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {styles} from './styles';
import axios from "axios";
import { VscError } from "react-icons/vsc";
import { BsCheckCircle } from "react-icons/bs";


const ListNewItemSchema = Yup.object({

  gametype: Yup.string().required('Required'),        
  name: Yup.string().required('Required'), 
  itemcondition: Yup.string().required('Required'), 
  platform: Yup.string().when('gametype', {
    is: 'Computer game',
    then: Yup.string().required('Required')  }),

  piececount: Yup.string().when('gametype', {
    is: 'Jigsaw puzzle',
    then: Yup.string().required('Required')  }),

  platformname: Yup.string().when('gametype', {
    is: 'Video game',
    then: Yup.string().required('Required')  }),
  media: Yup.string().when('gametype', {
    is: 'Video game' ,
    then: Yup.string().required('Required')  }),
  
  });


export default function ListNewItemForm() {

  const email = JSON.parse(localStorage.getItem('email'));
  const [platformOptions, setPlatformOptions] = useState([]);
  let [computerGame, setComputerGame] = useState(false);
  let [jigsawPuzzle, setJigsawPuzzle] = useState(false);
  let [videoGame, setVideoGame] = useState(false);
  let [error, setError] = useState(false);
  let [success, setSuccess] = useState(false);
  let [disable, setDisable] = useState(false);
  let [showForm, setShowForm] = useState(true);


  const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(ListNewItemSchema),
        defaultValues: {
          gametype:"",          
          name: "",
          itemcondition: "",
          description: "",
          platform: "",
          piececount: "",
          platformname: "",
          media: "",      
   
        }
  });
      

    const onSubmit = data => {
     // alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
        axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=ListNewItem", {
          params: {
           // action: 'ListNewItem',
            email: email,            
            },
            data,

        }).then(function (response) {          
         // alert(response.data.Info);
          console.log(response);
          setSuccess("New item has been listed! Item number is " + response.data.itemnumber + ".");
          setDisable(true);
          setShowForm(false);
        })
        .catch(function (error) {
          console.log(error);
          setError(error);
        });     
    };

    function getPlatformList() {      
      axios.get('http://localhost/GameSwap/php_backend_api/index.php?action=PlatformList')
      .then(function (response) {
            // handle success
            console.log(response);                   
            if (response.data.success) {
              //console.log(response.data.data); 
              setPlatformOptions(response.data.data);            
              //alert(response.data.data[2]["platformname"]);  
            } 
            if (!response.data.success) {
              //setError(response.data.Info);  
            }      
                
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            setError(error);
        })
        .then(function () {
            // always executed
        });

  }


  


  const handleChange = (event) => {
    //alert(event.target.value); 

    switch(event.target.value) {
      case "Computer game":
        setComputerGame(true);  setJigsawPuzzle(false); setVideoGame(false); 
        break;
      case "Jigsaw puzzle":
        setComputerGame(false);  setJigsawPuzzle(true); setVideoGame(false);
        break;
      case "Video game":
        getPlatformList();
        setComputerGame(false);  setJigsawPuzzle(false); setVideoGame(true);
        break;
      default:
        setComputerGame(false);  setJigsawPuzzle(false); setVideoGame(false);
    }
   
  };

   
const dismissError = () => {
    setError("");
}

const dismissSuccess = () => {
  setSuccess("");
}
  

return (  
  <div>
     
     { error &&
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>     
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" onClick={dismissError}>
          <button><VscError className="inline-block align-top"/> {error} </button>      
       </div></div>                  
      }
      { success && 
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>     
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" onClick={dismissSuccess}>
            <button><BsCheckCircle className="inline-block align-top"/> {success} </button>
        </div></div>                  
      }

{ showForm && 
<form onSubmit={handleSubmit(onSubmit)}  className={styles.form} > 


     <div className='text-dark-blue-400 text-2xl mb-3 font-semibold mb-7'>List a New Item</div>
     <div className="w-96 grid grid-cols-2 gap-4">
 
     <div className={styles.gridRow} >Game type                           
                <select {...register("gametype")} className={styles.select} onChange={handleChange} >
                  <option value="">Select a Game type</option>
                  <option value="Board game">Board game</option>
                  <option value="Card game">Card game</option>
                  <option value="Video game">Video game</option>
                  <option value="Computer game">Computer game</option>
                  <option value="Jigsaw puzzle">Jigsaw puzzle</option>
                </select>
                <p className={styles.errorMsg}>{errors.gametype?.message}</p>    
     </div> 

    <div className={styles.gridRow} >Condition                          
                <select {...register("itemcondition")} className={styles.select} >
                  <option value="">Select a Condition</option>
                  <option value="Mint">Mint</option>
                  <option value="Like New">Like New</option>
                  <option value="Lightly Used">Lightly Used</option>
                  <option value="Moderately Used">Moderately Used</option>
                  <option value="Heavily Used">Heavily Used</option>
                  <option value="Damaged/Missing parts">Damaged/Missing parts</option>
                </select>
                <p className={styles.errorMsg}>{errors.itemcondition?.message}</p>    
     </div>  

     <div className="relative z-0 mb-6 w-full group grid col-span-2" >
            <input className={styles.field} {...register("name")} placeholder=" " />  
            <label className={styles.label} >Game Title</label>
            <p className={styles.errorMsg}>{errors.name?.message}</p>
    </div>   

     <div className="relative z-0 mb-6 w-full group grid col-span-2" >
            <textarea  className={styles.field} {...register("description")} placeholder=" " />  
            <label className={styles.label} >Description</label>
            <p className={styles.errorMsg}>{errors.description?.message}</p>
    </div>
    

{ computerGame &&  <div className="relative z-0 mb-6 w-full group grid col-span-2" >
    <div className={styles.gridRow} >Platform                          
                <select {...register("platform")} className={styles.select} >
                  <option value="">Select a Platform</option>
                  <option value="Linux">Linux</option>
                  <option value="macOS">macOS</option>
                  <option value="Windows">Windows</option>
                </select>
                <p className={styles.errorMsg}>{errors.platform?.message}</p>    
     </div>
     </div>
}

{ jigsawPuzzle &&  <div className="relative z-0 mb-6 w-full group grid col-span-2" >

      <div className={styles.gridRow} >
          <input type="number" className={styles.field_short} {...register("piececount")} placeholder=" " /> 
          <label className={styles.label} >Piece Count</label>
          <p className={styles.errorMsg}>{errors.piececount?.message}</p>
      </div>
        
    </div>
}


{ videoGame &&  <div className={styles.gridRow} >Platform                          
                <select {...register("platformname")} className={styles.select} >
                  <option value="">Select a Platform</option>
                  {platformOptions.map(value => (
                    <option key={value.platformID} value={value.platformID}>
                      {value.platformname}
                    </option>
                  ))}
                </select>
                <p className={styles.errorMsg}>{errors.platformname?.message}</p>    
     </div>
    }
{ videoGame &&    <div className={styles.gridRow} >Media                           
                <select {...register("media")} className={styles.select} >
                  <option value="">Select a Media</option>
                  <option value="Optical disc">Optical disc</option>
                  <option value="Game card">Game card</option>
                  <option value="Cartridge">Cartridge</option>
                </select>
                <p className={styles.errorMsg}>{errors.media?.message}</p>    
     </div>
}

    


          <div>  
            <button disabled={disable} className={styles.button} type="submit"> Submit</button>
          </div> 
          <div></div>
          
       
          
          

    </div>

     </form>
} 


        
  </div> 
);
}