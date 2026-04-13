import { api } from "./api";
import axios from "axios";

export const uploadApi = {
  /**
   * Fetches a signed signature from the backend for direct upload to Cloudinary.
   */
  getSignature: (folder: string = "mediconnect/profiles") => 
    api.get(`/upload/signature?folder=${folder}`),

  /**
   * Uploads a file directly to Cloudinary using a signed signature.
   */
  uploadToCloudinary: async (file: File, signatureData: any) => {
    const { timestamp, signature, apiKey, cloudName } = signatureData;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "mediconnect/profiles"); // Must match backend folder

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return response.data.secure_url;
  }
};
