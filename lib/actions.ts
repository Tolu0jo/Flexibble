import { ProjectForm, userForm } from "@/common.types";
import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  projectsQuery,
  updateProjectMutation,
  updateUserMutation,
} from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isproduction = process.env.NODE_ENV === "production";
const apiUrl = isproduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_ENDPOINT
   || ""
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
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };
  return makeGraphQLRequest(createUserMutation, variables);
};
export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`); //NextAuth publish your token here automatically
    return response.json();
  } catch (error) {
    throw error;
  }
};
export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`); // restriction for only people logged in
    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (
  category?: string,
  endcursor?: string
) => {
 
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(projectsQuery, { category, endcursor });
};

export const getProjectDetails =(id:string)=>{
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery,{id})
}
export const getUserProjects =(id:string, last?:number)=>{
 client.setHeader('x-api-key', apiKey);
 return makeGraphQLRequest(getProjectsOfUserQuery,{id,last})
}

export const deleteProject =(id:string, token:string)=>{
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation,{id})
 }


 export const updateProject =async (form:ProjectForm, projectId:string, token:string)=>{
  
  function  isBase64DataUrl(value:string){
    const isbase64Url = /^data:image\/[a-z]+;base64,/;
    return isbase64Url.test(value)
  }
  
  let updatedForm = {...form}
   const isUploadingNewImage = isBase64DataUrl(form.image)
    if(isUploadingNewImage) {
      const imageUrl = await uploadImage(form.image)
      if(imageUrl.url){
        updatedForm ={
          ...form,
          image:imageUrl.url
        }
      }  
    }
const variables ={
  id:projectId,
  input:updatedForm
}
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation,variables)
 }



export const updateUser = (form:userForm, userId:string, token:string)=>{

const variables ={
  id:userId,
  input:form
  }
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(updateUserMutation,variables)
 }