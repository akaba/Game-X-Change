import React, { useState }  from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {styles} from './styles';
import { Link } from "react-router-dom";
import axios from "axios";
import { VscError } from "react-icons/vsc";
import { GiCardExchange } from "react-icons/gi";



const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required').min(3, 'Username must be at least 3 characters!'),
  password: Yup.string().required('Required').min(3, 'Password must be at least 3 characters!').max(50, 'Too Long!'), 
});



export default function LoginForm() {

  let [error, setError] = useState(false);

  const dismissError = () => {
    setError("");
}

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      username: "usr615@gt.edu",
      password: "pass615",      
    }
});

  const onSubmit = data => {
    
    axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=Login", {
      data
    })
    .then(function (response) {
      console.log(response);
      //alert(response.data.info);
            if (response.data.success) {
                //alert('SUCCESS!! :-)\n\n' + JSON.stringify(response.data, null, 4));
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('email', JSON.stringify(response.data.email));  
                localStorage.setItem('fullname', JSON.stringify(response.data.fullname));               
                window.location.href = "MainMenu"; 

            } 
            if (!response.data.success) { 
              setError(response.data.info);
            }

    })
    .catch(function (error) {
      console.log(error);
    });
 
};



return (  
  
  <div>    
    <form onSubmit={handleSubmit(onSubmit)}  className={styles.form} >    
    { error &&
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" onClick={dismissError}>
          <button onClick={dismissError}><VscError className="inline-block align-top"/> {error} </button>
       </div>                  
      }   
      <div className="text-gray-400 text-2xl mb-5 text-blue-600"> 
        <GiCardExchange className="inline-block"/> Game Swap </div>

    <div className='text-dark-blue-400 text-2xl mb-3 font-semibold'>Sign in</div>
    <div className="w-80 grid grid-cols-1 gap-4">

         <div className={styles.gridRow} >
              <input className={styles.field} {...register("username")} placeholder=" " /> 
              <label className={styles.label} >Email or Phone Number</label>         
              <p className={styles.errorMsg}>{errors.email?.message}</p>
          </div>
          <div className={styles.gridRow} >           
              <input className={styles.field} {...register("password")} placeholder=" " type="password" />  
              <label className={styles.label} >Password</label>                  
              <p className={styles.errorMsg}>{errors.password?.message}</p>
          </div>
          <div className={styles.gridRow} >  
            <button className={styles.button} type="submit"> Submit</button>
          </div> 
        
    </div>
    </form>

    <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>No account? 
             <Link to="Register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-2"> Register!</Link>
          </div>

    
   
  </div>
);
}

