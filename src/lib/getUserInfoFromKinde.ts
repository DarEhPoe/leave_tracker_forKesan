// This forces server-side rendering instead of static generation
export const dynamic = 'force-dynamic'

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as kindeInit } from "@kinde/management-api-js";

export  async function getUserNameFromAuth(){
  const {getUser } = getKindeServerSession()
  const [user] = await Promise.all([
      getUser(),
  ])

  if (!user) {
    throw new Error("User is not authenticated")
  }

  const name = `${user.username}`

  const username=name.includes('_') ? name.replace(/_/g, ' ') : name;
  return (
    username
  )
}



export async function getUserPermissions() {

     
  const { getPermission } = getKindeServerSession();

  const [managerPermission, adminPermission, userPermission] = await Promise.all([
    getPermission("manager"),
    getPermission("admin"),
    getPermission("staff"),
  ]);

  const permissions: string[] = [];

  if (managerPermission?.isGranted) permissions.push("manager");
  if (adminPermission?.isGranted) permissions.push("admin");
  if (userPermission?.isGranted) permissions.push("staff");

  return permissions;
}



export async function getUserEmail() {
  kindeInit() // Initializes the Kinde Management API 
  const { users } = await Users.getUsers()
  const techs = users ? users.map(user => ({ id: user.email!, description: user.email! })) : []
  return techs;

}





