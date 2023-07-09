import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserMutation, getUserQuery } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isproduction = process.env.NODE_ENV === "production";
const apiUrl = isproduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
  : "http://127.0.0.1:4000/graphql";

const apiKey = isproduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
  : "letmein";
const serverUrl = isproduction
  ? process.env.NEXT_PUBLIC_SERVER_URL || ""
  : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);
const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email: string) => {
    client.setHeader('x-api-key', apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (email: string, name: string, avatarUrl: string) => {
    client.setHeader('x-api-key', apiKey);
    const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };
  return makeGraphQLRequest(createUserMutation, variables);
};
export const fetchToken =async ()=>{
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`) //NextAuth publish your token here automatically
    return response.json();
  } catch (error) {
    throw error; 
  }
}
export const uploadImage =async (imagePath:string)=>{
  try {
    const response = await fetch(`${serverUrl}/api/upload`,{
     method: "POST",
     body: JSON.stringify({path:imagePath})
    })
    return response.json();
  } catch (error) {
    throw  error; 
  }
}


export const createNewProject=async(form:ProjectForm, creatorId:string, token:string) => {
     const imageUrl = await uploadImage(form.image);

     if(imageUrl.url){
      client.setHeader("Authorization", `Bearer ${token}`); // restriction for only people logged in
      const variables ={
        ...form,
        image:imageUrl.url,
        createdBy:{
          link:creatorId,
        }
      }
       return makeGraphQLRequest(createProjectMutation,variables)
     }
};
