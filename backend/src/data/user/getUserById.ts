import { GetUserByIdInput } from "../../data/interfaces/interface.user";
import { User, UserData } from "../db/entities/User";

export const getUserById = async (input: GetUserByIdInput) => {
    try {
      const { id } = input
      const user = new User({id})
      const userData = await user.get()
      return userData ? userData as UserData : null
    } catch (error) {
      console.log(error)
      throw new Error('Error geting user')
    }
  }
  