import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import React from 'react';
import Auth from "./Auth.js";

export default function ExecDashboard() {
  //console.log(Auth.userName);
 const [clubs, setData] = useState([]);
  const getExecList = async (user) => {
    const { data, error } = await supabase
      .from(user.id)
      .select('CSO, Role')
      .eq('Role', 'exec')
      

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking profile:', error)
      return
    }
    if(data){
      
    // clubs.append(data.CSO);
    data.forEach((club)=>{
      clubs.push(club.CSO);
    }
  )
    //console.log(data)
    //console.log("Echp");
    //console.log(clubs);
    }
  }


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
       const user = session.user;
       getExecList(user);
        
    }
         else {
          console.log("No session");
          
        }
      })
});

//getExecList(userIdForExec);

const createList = (list) => {
  const listItems = list.map(club =>
    <li>{club}</li>
  );
  return listItems;
}
const cso_list = createList(clubs);
  //  const listItems = clubs.map(person =>
  //   <li>{person}</li>
  // );
  
  return (
    <main>
      <h1>Exec Member Dashboard</h1>
      <p data-testid = "welcome">Welcome, executive member! Here you can oversee operations and review reports.</p>
      <ul data-testid = "cso-list">{cso_list}</ul>;
      
    </main>
  );
}

