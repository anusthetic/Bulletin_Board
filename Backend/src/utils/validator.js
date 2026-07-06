// const validator = require("validator");

// const validate = (data)=>{

//     const mandatoryField = ['name','email','password'];
//     const isAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));
//     // console.log(isAllowed);
//     // console.log(data);
//     // console.log(Object.keys(data));
//     if(!isAllowed)
//         throw new Error("Some Field Missing");

//     if(!validator.isEmail(data.email))
//         throw new Error("Invalid Email");

//     if(!validator.isStrongPassword(data.password))
//         throw new Error("Not a strong password");


// }

// module.exports = validate;