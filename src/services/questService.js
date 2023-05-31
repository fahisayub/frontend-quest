import { CONSTS } from "../Consts";



const verifyTask = async (questId,task) => {
    const obj = {
      questId: questId,
      task: task,
    };
    console.log({...obj})

    const response = await fetch(`${CONSTS.SERVER_URL}/quest/completeTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(obj),
    });
   const data = await response.json()
   console.log(data);
   if(data.error){
    alert(data.data);
  };
  if(typeof(data)=="string"){
    alert(data);
    return {data,status:0,error:true}
  }
  return data;
}
  export default verifyTask;