const defaultCallback = (err, result) => {
    if (err) {
        console.error('Operation Error:', err);
    } else {
        console.log('Operation Successful:', result);
    }
};



module.exports = {
 defaultCallback
  
};