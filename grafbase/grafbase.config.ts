import { g, auth, config } from '@grafbase/sdk'
//Models

//@ts-ignore
  const User = g.model('User',{
    name: g.string().length({min:2,max:20}),
    email: g.string().unique(),
    avatarUrl: g.url(),
    description: g.string().optional(),
    githubUrl: g.url().optional(),
    linkedinUrl: g.url().optional(),
    projects:g.relation(()=>Project).list().optional(),//user can have many projects
     }).auth((rules)=>{rules.public().read()}) //everybody can see the project

//@ts-ignore
const Project = g.model('Project',{
  title: g.string().length({min:3}),
  description: g.string(),
  image:g.url().optional(),
  liveSiteUrl:g.url(),
  githubUrl: g.url(),
  category:g.string().search(),
  createdBy:g.relation(()=>User) //means the project is created by a user
}).auth((rules)=>{
  rules.public().read(),
  rules.private().create().delete().update() //everybody can see but do nothing else
})

const jwt = auth.JWT({
  issuer:"grafbase",
  secret: "{{ env.NEXTAUTH_SECRET }}"
})
export default config({
  schema: g,
  auth:{
    providers:[jwt],
    rules:(rules)=>rules.private()
  }
}) 