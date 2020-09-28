async function getRemaining(database,_collection) {
  try {
    let collection = database.collection(_collection);
    let results = await collection
      .aggregate([{ $match: { responded: null } }, { $count: "responded" }])
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
module.exports ={ getRemaining,getTotal };
