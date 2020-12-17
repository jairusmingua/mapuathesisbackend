async function getRemaining(database,_collection) {
  try {
    let collection = database.collection(_collection);
    let results = await collection
      .aggregate([{ $match: { responded: null } }, { $count: "remaining" }])
      .toArray();
    return results[0];
  } catch (error) {
    return error;
  }
}
async function getTotal(database,_collection) {
  try {
   
    let collection = database.collection(_collection);
    let results = await collection.aggregate([{ $count: "total" }]).toArray();
    return results[0];
  } catch (error) {
    return error;
  }
}
async function getRecent(database,_collection){
  try {
    let collection = database.collection(_collection);
    let results = collection.aggregate([{$sort:{dateResponded:-1}},{$limit:5}]).toArray()
    return results;
  } catch (error) {
    return error;
  }
}
async function getLast(database,_collection){
  try {
    let collection = database.collection(_collection);
    let results = collection.aggregate([{$sort:{datePosted:-1}},{$limit:5}]).toArray()
    return results;
  } catch (error) {
    return error;
  }
}
async function getRole(database,_collection,user){
  try{
    let collection = database.collection(_collection);
    let role = await collection.findOne(user);
    return {role:role["role"]!=undefined?role["role"]:null}

  }catch(err){
    return err;
  }
}
async function getStatus(database,_collection){
  try {
    let collection = database.collection(_collection);
    let yeslabels = await collection.aggregate([{$match:{label:1}},{$count:"yeslabels"}]).toArray();
    let nolabels= await collection.aggregate([{$match:{label:0}},{$count:"nolabels"}]).toArray();
    let total = await getTotal(database,_collection);
    let remaining =await getRemaining(database,_collection);
    return {
      yes:yeslabels[0]==undefined?0:yeslabels[0]['yeslabels'],
      no:nolabels[0]==undefined?0:nolabels[0]['nolabels'],
      total:total==undefined?0:total['total'],
      remaining:remaining==undefined?0:remaining['remaining']
    }
  } catch (error) {
    throw error
  }
}
module.exports ={ getRemaining,getTotal,getStatus,getRole,getRecent,getLast };
