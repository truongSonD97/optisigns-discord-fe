import axios from "axios";
import axiosInstance from "./axiosInstance";

const DUMMY_URL = 'https://media.istockphoto.com/id/627795510/photo/example.jpg?s=612x612&w=0&k=20&c=lpUf5rjPVd6Kl_M6heqC8sUncR4FLmtsRzeYdTr5X_I='
const DUMMY_VIDEO_URL = 'https://www.youtube.com/watch?v=EngW7tLk6R8'
export const uploadFileToS3 = async (file: File) => {
  try {
    const fileType = file?.type || null;
    const fileExt = file?.name?.split('.')?.length
      ? file?.name?.split('.')?.pop()
      : null;
    const params = {
        fileType,
        fileExt,
      };
    // Request a signed URL from the backend
    const { data } = await axiosInstance.get(`/aws/s3-signed`,{params});

    // Upload file to S3
    await axios.put(data.url, file, { headers: { "Content-Type": file.type } });
    return data.url; // Return the uploaded file URL
  } catch (error) {
    console.error("Upload failed:", error);
    // return null;
    // return demo  if don't have s3
    // return DUMMY_URL
    return DUMMY_VIDEO_URL
  }
};
