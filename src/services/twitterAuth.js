import { CONSTS } from "../Consts";
import verifyTask from "./questService";

const twitteAuth = async (questId,task) => {
    console.log("working ");
    const key = await fetch(`${CONSTS.SERVER_URL}/user/twitter/${localStorage.getItem("jwtToken")}`).then(response => response.json())
    .then(data => {
      console.log("token",data)
      return data}).catch((err)=>{
        console.log(err);
      })
      if(key.error){
        console.log({task,questId})
       return await verifyTask(questId,task);
      }
    try {
      const redirect_uri = encodeURIComponent(`${CONSTS.HOST_URL}/callback`);
      console.log(redirect_uri); 
        window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${key.token}&oauth_callback=${redirect_uri}`;
    } catch (err) {
      console.error('Error here', err);
    }
  };

  export default twitteAuth