const validator = require("validator");

const parsePagination = (query) => {
    let limit = parseInt(query.limit, 10);
    let offset = parseInt(query.offset, 10);

    if (isNaN(limit) || limit <= 0) limit = 20;
    if (limit > 100) limit = 100; // hard cap

    if (isNaN(offset) || offset < 0) offset = 0;

    return { limit, offset };
}

const sendError = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        details,
    });
}

const validate = (data)=>{

    const mandatoryField = ['name','email','password'];
    const isAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));
    // console.log(isAllowed);
    // console.log(data);
    // console.log(Object.keys(data));
    if(!isAllowed)
        throw new Error("Some Field Missing");

    if(!validator.isEmail(data.email))
        throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Not a strong password");


}

function findMissingFields(body, requiredFields) {
    const missing = [];
    for (const field of requiredFields) {
        const value = body[field];
        if (value === undefined || value === null || value === '') {
            missing.push(field);
        }
    }
    return missing;
}

function isValidDate(value) {
    return !isNaN(new Date(value).getTime());
}

function isValidDateRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    return start < end;
}

module.exports = {parsePagination,sendError,validate,findMissingFields,isValidDate,isValidDateRange};