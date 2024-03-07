import * as dotenv from 'dotenv';
dotenv.config();

export const handleErrorMessage = (error: any): string => {
  if (error.details && error.details.length > 0) {
    const errorMessage = error.details[0].message;
    if (errorMessage) {
      const parts = errorMessage.split(', ');
      if (parts.length > 1) {
        return parts[1].trim(); // Trim any leading or trailing whitespace
      }
      console.log('error', errorMessage);
      return errorMessage.trim(); // Trim any leading or trailing whitespace
    }
  }
  return 'No error message provided'; // Handle the case where errorMessage is undefined or empty
};

export const chainCodeHelpers = {
  "/api/v1/user": process.env.REGISTRATION_CHAINCODE,
}



