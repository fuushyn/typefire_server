import {app}  from './auth.js'


import { getFirestore, collection, getDocs, doc,addDoc, query, where, orderBy, limit, updateDoc } from 'firebase/firestore/lite';

import express from 'express';

var router = express.Router();
const db = getFirestore(app);


async function getHighScore(userDet){
  const q1 = query(collection(db, "scores"), where("user", "==", userDet.uid),orderBy("negscore"), limit(1));

  const q2 = query(collection(db, "scores"), where("user", "==", userDet.uid),orderBy("negwpm"), limit(1));

  let best,wpm;

  const querySnapshot1 = await getDocs(q1);
  const querySnapshot2= await getDocs(q2);

  querySnapshot1.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    best = doc.data().score
  });
  querySnapshot2.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    wpm = doc.data().wpm
  });
  return {
    'best': best,
    'wpm': wpm 
  };
}


async function getLeaderboardData(){
  const q1 = query(collection(db, "highscores"),orderBy("negscore"), limit(15));
  // let leaderboardScore = []

  // const tableBody = document.getElementById('table-body')
  // tableBody.innerHTML = '';

  const querySnapshot1 = await getDocs(q1);
  console.log(querySnapshot1);
  // querySnapshot1.then((data)=>{
  //   console.log(data);
  // })

  let docs = []
  querySnapshot1.forEach((doc)=>{
    docs.push(doc.data())
  })
  return docs
}


async function addScore(userDet, result, score){
  const uid = userDet.uid;
  const uname = userDet.displayName
  const docRef = await addDoc(collection(db, "scores"), {
    wpm: result,
    score: score,
    user: uid,
    username: uname,
    negwpm: 10000-result,
    negscore: 10000-score
  });
  return;

}

async function addUpdateHighScore(userDet, result, score){
  const uid = userDet.uid;
  const uname = userDet.displayName

  const q = query(collection(db, "highscores"), where("user", "==", userDet.uid));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty){
    await addDoc(collection(db, 'highscores'),{
      wpm: result,
      score: score,
      user: uid,
      username: uname,
      negwpm: 10000-result,
      negscore: 10000-score,
      timestamp: (new Date()).getTime()
    })
  }
  else{
    let docs = []
    querySnapshot.forEach((doc)=>{

        docs.push(doc)
      
    })
    console.log(docs)
    console.log(`new: ${score} prev: ${docs[0].data().score}`)
    if(docs[0].data().score < score){
      const updateRef = await updateDoc(docs[0].ref, {
        wpm: result,
        score: score,
        negwpm: 10000-result,
        negscore: 10000-score,
        timestamp: (new Date()).getTime()
        });
        console.log(`Updated ref with id: ${updateRef}`)
    }

  }
  return;


}
router.post('/geths', async function(req, res, next) {
  console.log(req.body);
  let user = (req.body);

  const result = await getHighScore(user);
  res.json(result);
});

router.get('/lbdata', async function(req, res, next) {
  let data = await getLeaderboardData();
  res.send(JSON.stringify({data: data}))
  
});

router.post('/addscore', async function(req,res,next){
  console.log(req.body);
  let user = ((req.body).user);
  let score = (req.body).score;
  let result = (req.body).result;

  await addScore(user, result, score);
  await addUpdateHighScore(user, result, score);

  res.send('OK');
})

router.post('/addupdatehs', async function(req,res,next){
  console.log(req.body)
  let user = ((req.body).user) 
  let score = (req.body).score
  let result = (req.body).result

  console.log(`user: ${user.uid} score: ${score} result: ${result}`);
  await addUpdateHighScore(user, result, score);
  // console.log(4);
  res.send('OK');
})

export default router;
 