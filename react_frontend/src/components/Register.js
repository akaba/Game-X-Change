import React, { useState }  from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {styles} from './styles';
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import axios from "axios";
import { VscError } from "react-icons/vsc";
import { GiCardExchange } from "react-icons/gi";

const RegisterSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required').min(3, 'Password must be at least 3 characters!').max(50, 'Too Long!'),
  confirm_password: Yup.string().required('Required').min(3, 'Password must be at least 3 characters!').max(50, 'Too Long!')
  .oneOf([Yup.ref('password')], 'Passwords must match'),
  firstname: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!'),
  lastname: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!'),
  nickname: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!'),
  city: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!').matches(/^[aA-zZ\s]+$/, {message: 'Only letters are allowed'}), 
  state: Yup.string().required('Required').min(1, 'Too Short!').max(2, 'Maximum 2 characters are allowed').matches(/^[aA-zZ\s]+$/, {message: 'Only letters are allowed for this field'}), 
  postalcode: Yup.string().required('Required').matches(/\d{5}/, {message: 'Invalid postal code'}), 
  phonenumber: Yup.string().matches(/^(1-)?\d{3}-\d{3}-\d{4}$/, {
                  excludeEmptyString: true,
                  message: 'Invalid phone number' }),  
  phonetype: Yup.string().when('phonenumber', {
                is: (phonenumber) => phonenumber.length > 1 ,
                then: Yup.string().required('Required')  }),   
  });


export default function RegisterForm() {

let [error, setError] = useState(false)

    const { register, handleSubmit, control,  formState: { errors } } = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues: {
          email: "akaba7@gatech.edu",
          password: "123",
          confirm_password: "123",
          firstname: "bill",
          lastname: "luo",
          nickname: "billy",
          city: "Washington",
          state: "MN",
          postalcode: "77489",          
          phonenumber: "",
          phonetype: "",
          showphone: false,
   
        }
    });




    const onSubmit = data => {
        axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=Register", {
          data
        })
        .then(function (response) {          
         // alert(response.data.Info);
          console.log(response);
          setError(response.data.info);
        })
        .catch(function (error) {
          console.log(error);
          setError(error);
        });     
    };

 
  const dismissError = () => {
      setError("");
  }

return (  
  <div>
     <form onSubmit={handleSubmit(onSubmit)}  className={styles.form} > 
     { error &&
     
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" onClick={dismissError}>
          <button onClick={dismissError}><VscError className="inline-block text-red-400 align-top"/> {error} </button>
       </div>                  
      }
      <div className="text-gray-400 text-2xl mb-5 text-blue-600"> 
        <GiCardExchange className="inline-block"/> Game Swap </div>

     <div className='text-dark-blue-400 text-2xl mb-3 font-semibold'>Register</div>
     <div className="grid grid-cols-3 gap-4">
        
          <div className={styles.gridRow} >
              <input className={styles.field} {...register("email")} placeholder=" " type="email" /> 
              <label className={styles.label} >Email</label>         
              <p className={styles.errorMsg}>{errors.email?.message}</p>
          </div>
          <div className={styles.gridRow} >           
              <input className={styles.field} {...register("password")} placeholder=" " type="password" />  
              <label className={styles.label} >Password</label>                  
              <p className={styles.errorMsg}>{errors.password?.message}</p>
          </div>
          <div className={styles.gridRow} >
              <input className={styles.field} {...register("confirm_password")} placeholder=" " type="password" />
              <label className={styles.label} >Confirm Password</label>          
              <p className={styles.errorMsg}>{errors.confirm_password?.message}</p>
          </div>    
          <div className={styles.gridRow} >
            <input className={styles.field} {...register("firstname")} placeholder=" " />  
            <label className={styles.label} >First Name</label>
            <p className={styles.errorMsg}>{errors.firstname?.message}</p>
          </div> 
          <div className={styles.gridRow} >        
            <input className={styles.field} {...register("lastname")} placeholder=" " />
            <label className={styles.label} >Last Name</label>
            <p className={styles.errorMsg}>{errors.lastname?.message}</p>
          </div> 
          <div className={styles.gridRow} >
            <input className={styles.field} {...register("nickname")} placeholder=" "/>
            <label className={styles.label} >Nickname</label>
            <p className={styles.errorMsg}>{errors.nickname?.message}</p> 
         </div>
          <div className={styles.gridRow} >
            <input className={styles.field} {...register("city")} placeholder=" "/>
            <label className={styles.label} >City</label>
            <p className={styles.errorMsg}>{errors.city?.message}</p>
          </div>
          <div className={styles.gridRow} >
            <input className={styles.field} {...register("state")} placeholder=" "/>
            <label className={styles.label} >State (TX)</label>
            <p className={styles.errorMsg}>{errors.state?.message}</p>
          </div>
          <div className={styles.gridRow} >
            <Controller
              control={control}
              name="postalcode"                         
              render={({ field: { onChange, name, value } }) => (
                <NumberFormat
                  format="#####"
                  mask="_"              
                  name={name}
                  placeholder=" "
                  value={value}
                  className={styles.field}
                  onChange={onChange}  
                />
              )}
            />                      
            <label className={styles.label} >Postal Code</label>
            <p className={styles.errorMsg}>{errors.postalcode?.message}</p>
          </div>

          <div className={styles.gridRow} >
            <Controller
              control={control}
              name="phonenumber"                         
              render={({ field: { onChange, name, value } }) => (
                <NumberFormat
                  format="###-###-####"
                  mask="_"
                  name={name}
                  placeholder=" "
                  value={value}
                  className={styles.field}
                  onChange={onChange}  
                />
              )}
            />                      
            <label className={styles.label} >Phone (123-456-7890)</label>
            <p className={styles.errorMsg}>{errors.phonenumber?.message}</p>
          </div>
    
          <div className={styles.gridRow} >Phone type                        
                <select {...register("phonetype")} className={styles.select} >
                  <option value="">Select a phone type</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Mobile">Mobile</option>
                </select>
                <p className={styles.errorMsg}>{errors.phonetype?.message}</p>    
          </div> 
          <div className={styles.gridRow} >              
                <input name="showphone" type="checkbox" {...register("showphone")} className={styles.checkbox} />                 
                <label htmlFor="showphone" className={styles.checkbox_label}>Show phone number in swaps</label>                    
                <p className={styles.errorMsg}>{errors.showphone?.message}</p>  
                           
          </div>

          <div>  
            <button className={styles.button} type="submit"> Submit</button>
          </div> 
          <div></div>
          <div></div>
          
         

    </div>
     </form>

     <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>Already have an account? 
          <Link to="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-2"> Sign in!</Link>
          </div> 


        
  </div> 
);
}