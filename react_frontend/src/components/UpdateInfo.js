import React, { useState, useEffect }  from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {styles} from './styles';
import axios from "axios";
import { VscError } from "react-icons/vsc";


const UpdateSchema = Yup.object({
 // email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required').min(3, 'Password must be at least 3 characters!').max(50, 'Too Long!'),
  confirm_password: Yup.string().required('Required').min(3, 'Password must be at least 3 characters!').max(50, 'Too Long!')
  .oneOf([Yup.ref('password')], 'Passwords must match'),
  firstname: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!'),
  lastname: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!'),
  nickname: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!'),
  city: Yup.string().required('Required').min(1, 'Too Short!').max(50, 'Too Long!').matches(/^[aA-zZ\s]+$/, {message: 'Only letters are allowed'}), 
  state: Yup.string().required('Required').min(1, 'Too Short!').max(2, 'Maximum 2 characters are allowed').matches(/^[aA-zZ\s]+$/, {message: 'Only letters are allowed for this field'}), 
  postalcode: Yup.string().required('Required').matches(/\d{5}/, {message: 'Invalid postal code'}), 
  // phonenumber: Yup.string().matches(/^(1-)?\d{3}-\d{3}-\d{4}$/, {
  phonenumber: Yup.string().matches(/\d{10}/, {
                  excludeEmptyString: true,
                  message: 'Invalid phone number' }),  
  phonetype: Yup.string().when('phonenumber', {
                is: (phonenumber) => phonenumber.length > 1 ,
                then: Yup.string().required('Required')  }),   
  });
 


export default function UpdateInfo() {

      
      let [error, setError] = useState(false);    
      const [user, setUser] = useState(null);
      const token = localStorage.getItem('accessToken');      
      const email = JSON.parse(localStorage.getItem('email'));
  
      if (!token) {
          window.location.href = "/";      
      }
    

     
 const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(UpdateSchema), 
    });

    useEffect(() => {
      axios.post('http://localhost/GameSwap/php_backend_api/index.php?action=ViewUserInfo', {
          params: {
                  email: email,
          }
        }).then(function (response) {
          // handle success
          console.log(response);
          //setUser(response.data.userinfo);

          setTimeout(() => setUser({ 
            email: response.data.userinfo[0]['email'], 
            password: response.data.userinfo[0]['password'], 
            confirm_password: response.data.userinfo[0]['password'], 
            firstname: response.data.userinfo[0]['firstname'],
            lastname: response.data.userinfo[0]['lastname'],
            nickname: response.data.userinfo[0]['nickname'],
            city: response.data.userinfo[0]['city'],
            state: response.data.userinfo[0]['state'],
            postalcode: response.data.userinfo[0]['postalcode'],
            phonenumber: response.data.userinfo[0]['phonenumber'],
            phonetype: response.data.userinfo[0]['phonetype'],
            showphone: response.data.userinfo[0]['showphone'],
          
          }), 1000);    

              
      })
      .catch(function (error) {
          // handle error
          console.log(error);
      })
      .then(function () {
          // always executed
      });

  }, [email]);

function addDashes(f)
{
    return  f.slice(0,3)+"-"+f.slice(3,6)+"-"+f.slice(6);
}


// effect runs when user state is updated
useEffect(() => {
  // reset form with user data
  reset(user);

}, [user, reset]);




  const onSubmit = data => {  
      // alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
       axios.post("http://localhost/GameSwap/php_backend_api/index.php?action=UpdateUserInfo", {
         params: {     
           email: email,            
           },
           data,

       }).then(function (response) {          
        // alert(response.data.Info);
         console.log(response);   

         if (response.data.success) {         
         localStorage.setItem('fullname', JSON.stringify(response.data.fullname));  
         }

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
    {user &&
     <form onSubmit={handleSubmit(onSubmit)}  className={styles.form} > 
     { error &&
     
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" onClick={dismissError}>
          <button onClick={dismissError}><VscError className="inline-block text-red-400 align-top"/> {error} </button>
       </div>                  
      }

     <div className='text-dark-blue-400 text-2xl mb-7 font-semibold'>Edit Profile</div>
 
     <div className="grid grid-cols-3 gap-4">
        
          <div className={styles.gridRow} >           
          
          <input className={styles.field + ' bg-gray-300' }{...register("email",{ disabled: true })} type="email" /> 
          <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10" >Email</label>  
                     
              <p className={styles.errorMsg}>{errors.email?.message}</p>
          </div>
          <div className={styles.gridRow} >           
              <input className={styles.field} {...register("password")} placeholder=" " type="password"/>  
              <label className={styles.label} >Password</label>                  
              <p className={styles.errorMsg}>{errors.password?.message}</p>
          </div> 
          <div className={styles.gridRow} >
              <input className={styles.field} {...register("confirm_password")} placeholder=" " type="password"  />
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
          <input className={styles.field} {...register("postalcode")} placeholder=" "/>                    
            <label className={styles.label} >Postal Code</label>
            <p className={styles.errorMsg}>{errors.postalcode?.message}</p>
          </div>

          <div className={styles.gridRow} >
          <input className={styles.field} {...register("phonenumber")} placeholder=" "/>                    
            <label className={styles.label} >Phone (123-456-7890)</label>
            <p className={styles.errorMsg}>{errors.phonenumber?.message}</p>
          </div>
    
          <div className={styles.gridRow} >Phone type                        
                <select {...register("phonetype")} className={styles.select}  >
                  <option value="" >Select a phone type</option>          
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
            <button className={styles.button} type="submit"> Update</button>
          </div> 
          <div></div>
          <div></div>
          
    </div>
   
     </form>
}

        
  </div> 
);
}
