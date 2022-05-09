import React, { useEffect, useState }  from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {styles} from './styles';
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import axios from "axios";
import { VscError } from "react-icons/vsc";
import { BsCheckCircle } from "react-icons/bs";

const SearchItemsSchema = Yup.object({

   // keyword: Yup.string().required('Required'),        
   // myzip: Yup.string().required('Required'),
    searchType: Yup.string().nullable().required('Select a search option !'),
    keyword: Yup.string().when('searchType', {
      is: 'bykeyword',
      then: Yup.string().required('Required')  }), 
    withinmiles: Yup.string().when('searchType', {
      is: 'withinmiles',
      then: Yup.string().required('Required')  }), 
    inazip: Yup.string().when('searchType', {
      is: 'inazip',
      then: Yup.string().required('Required').matches(/\d{5}/, {message: 'Invalid postal code'}), }),

    });


export default function SearchItemsForm() {


  let [error, setError] = useState(false);
  let [success, setSuccess] = useState(false);
  let [showForm, setShowForm] = useState(true);
  let [showData, setShowData] = useState(false);
  let [pageTitle, setPageTitle] = useState("");
  let [searhKeyword, setSearhKeyword] = useState("");
  let [items, setItems] = useState([]);

  const email = JSON.parse(localStorage.getItem('email'));
  
  useEffect(() => {
    document.title = pageTitle;  
  }, [pageTitle]);

  
  function updatePageTitle(data) {
   if(data.searchType === 'bykeyword') setPageTitle('By Keyword "'+ data.keyword +'"');
   if(data.searchType === 'inmyzip') setPageTitle('In my postal code');
   if(data.searchType === 'withinmiles') setPageTitle('Within '+ data.withinmiles +' miles of me');
   if(data.searchType === 'inazip') setPageTitle('In postal code');
  }

  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(SearchItemsSchema),
        defaultValues: {
         // keyword:"",          
         // myzip: "",   
   
        }
  });

  const onSubmit = data => {
   // if(data.searchType === null)  setError("Select a search option!");

   // alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=SearchForItems", {
      params: {
       // action: 'ListNewItem',
        email: email,           
        },
        data,

    }).then(function (response) {          
     // alert(response.data.results);
      console.log(response);  

      if(!response.data.success) {
        setError(response.data.info);
        //alert(response.data.info);
        setTimeout(function(){
           window.location.href = 'SearchItems';
        }, 1000);      
      }

      if(response.data.success){
        setItems(response.data.results);
        updatePageTitle(data);  
        setShowData(true);
        //alert(response.data.results);   
        // alert(data.keyword); 
        setSearhKeyword(data.keyword);         
      }
      setShowForm(false);
      //setSuccess("response: " + response.data + ".");
     
    })
    .catch(function (error) {
      console.log(error);
      setError(error);
    }); 
    
    
  };

  
 
  const [selectedRadio, setSelectedRadio] = useState("");


    const handleChange = (e) => {
      setSelectedRadio(e.target.value);
      //alert(e.target.value);
    };

    const onChangeValue= (e) => {
      //alert(e.target.value);
     
    };

    const dismissError = () => {
      setError("");
  }
  
  const dismissSuccess = () => {
    setSuccess("");
  }

  function searchItems() {
    window.location.href = "SearchItems";
} 
            
    return (  
    <div>

     { error &&
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-0'>     
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


    <div className='text-dark-blue-400 text-2xl mb-3 font-semibold mb-4'>Search for Items</div>
    <div className="w-96 grid grid-cols-1 gap-4" onChange={onChangeValue}>


        <div> 
          <input type="radio" {...register("searchType")} onChange={handleChange}  value="bykeyword"  /> By Keyword  
        <input disabled={selectedRadio !== "bykeyword"} className={styles.fieldinline1} {...register("keyword")} placeholder=" " />   
        <p className={styles.errorMsg}>{errors.keyword?.message}</p>
        </div>

        <div>  
          <input type="radio" {...register("searchType")} onChange={handleChange} value="inmyzip" /> In my postal code 
        </div>
       


        <div>  
          <input type="radio" {...register("searchType")} onChange={handleChange}  value="withinmiles" /> Within   
        <input disabled={selectedRadio !== "withinmiles"} type="number" className={styles.fieldinline2} {...register("withinmiles")} placeholder=" " />
        miles of me 
        <p className={styles.errorMsg}>{errors.withinmiles?.message}</p>
        </div>
      

        <div>
          <input type="radio" {...register("searchType")} onChange={handleChange}  value="inazip" />  In postal code 
        
       
        <Controller
              control={control}              
              name="inazip"                                    
              render={({ field: { onChange, name, value } }) => (
                <NumberFormat
                  format="#####"
                  mask="_"              
                  name={name}
                  disabled={selectedRadio !== "inazip"}
                  placeholder=" "
                  value={value}
                  className={styles.fieldinline2}
                  onChange={onChange}                    
                />
              )}
            />
           <p className={styles.errorMsg}>{errors.inazip?.message}</p>      
        </div>
    
        <div>  
        <p className={styles.errorMsg}>{errors.searchType?.message}</p>
            <button className={styles.button} type="submit"> Submit</button>
        </div>       
         
    </div>
    </form>
}

{ showData &&
<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
           <div className='text-dark-blue-400 text-2xl mb-3 font-semibold mb-7'>Search results: {pageTitle}</div>
           
            <table className="table-auto border border-slate-400 w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead  className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>                        
                        <th className={styles.tablerow}>Item #</th>
                        <th className={styles.tablerow}>Game Type</th>
                        <th className={styles.tablerow}>Title</th>
                        <th className={styles.tablerow}>Condition</th>
                        <th className={styles.tablerow}>Description</th>
                        <th className={styles.tablerow}>Distance</th>
                        <th className={styles.tablerow}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, key, data) =>
                        <tr key={key}>
                            <td className={styles.tablerow}>{item.itemnumber}</td>
                            <td className={styles.tablerow}>{item.gametype}</td>                         
                            <td className={`border border-slate-300 dark:border-slate-700 p-1 pl-2  ${item.name!= null && item.name.includes(searhKeyword) ?  ' bg-blue-100' : ''}`} >{item.name}</td> 
                            <td className={styles.tablerow}>{item.itemcondition}</td>                           
                            <td className={`border border-slate-300 dark:border-slate-700 p-1 pl-2  ${item.description!= null && item.description.includes(searhKeyword) ?  ' bg-blue-100' : ''}`} >
                              {item.description!= null && item.description.length >100 ? item.description.slice(0, 100)+"..." : item.description }
                            </td> 
                            <td className={styles.tablerow}>{item.distance}</td>
                            <td className={styles.tablerow}> 
                            <Link to="/ViewItemDetails" state={{ itemdata:item }} className={styles.link}>Details</Link>
                            </td>                         
                        </tr>
                    )}


                    
                </tbody>
            </table>

            <div className="mt-5">
              <button onClick={searchItems} className={styles.button} type="button"> Search More Items</button>
              </div> 

                 
</div>
}


           

    

</div> 
);
}